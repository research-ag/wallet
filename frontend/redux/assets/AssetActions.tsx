import { HttpAgent } from "@dfinity/agent";
import store from "@redux/Store";
import { Token, TokenMarketInfo, TokenSubAccount } from "@redux/models/TokenModels";
import { IcrcAccount, IcrcIndexCanister, IcrcLedgerCanister } from "@dfinity/ledger";
import {
  formatIcpTransaccion,
  getSubAccountArray,
  getMetadataInfo,
  formatckBTCTransaccion,
  getUSDfromToken,
  hexToUint8Array,
  hexToNumber,
} from "@/utils";
import { setAssets, setTransactions, setTokenMarket, setICPSubaccounts } from "./AssetReducer";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/nns";
import { Asset, ICPSubAccount, SubAccount } from "@redux/models/AccountModels";
import { Principal } from "@dfinity/principal";
import { AccountDefaultEnum } from "@/const";
import bigInt from "big-integer";

export const updateAllBalances = async (
  loading: boolean,
  myAgent: HttpAgent,
  tokens: Token[],
  basicSearch?: boolean,
) => {
  let tokenMarkets: TokenMarketInfo[] = [];
  try {
    const auxTokenMarkets: TokenMarketInfo[] = await fetch(import.meta.env.VITE_APP_TOKEN_MARKET).then((x) => x.json());
    tokenMarkets = auxTokenMarkets.filter((x) => !x.unreleased);
  } catch {
    tokenMarkets = [];
  }

  try {
    const ethRate = await fetch(import.meta.env.VITE_APP_ETH_MARKET).then((x) => x.json());

    store.dispatch(
      setTokenMarket([
        ...tokenMarkets,
        {
          id: 999,
          name: "Ethereum",
          symbol: "ETH",
          price: ethRate.USD,
          marketcap: 0,
          volume24: 0,
          circulating: 0,
          total: 0,
          liquidity: 0,
          unreleased: 0,
        },
      ]),
    );
  } catch {
    store.dispatch(setTokenMarket(tokenMarkets));
  }

  const myPrincipal = await myAgent.getPrincipal();
  const newTokens: Token[] = [];
  const assets: Asset[] = [];

  await Promise.all(
    tokens.map(async (tkn) => {
      try {
        const { balance, metadata, transactionFee } = IcrcLedgerCanister.create({
          agent: myAgent,
          canisterId: tkn.address as any,
        });

        const myMetadata = await metadata({
          certified: false,
        });
        const myTransactionFee = await transactionFee({
          certified: false,
        });

        const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);

        const assetMarket = tokenMarkets.find((tm) => tm.symbol === symbol);
        const power = Math.pow(10, decimals);
        const subAccList: SubAccount[] = [];
        const userSubAcc: TokenSubAccount[] = [];

        // Basic Serach look into first 1000 subaccount under the 10 consecutive zeros logic
        // It iterates geting amount of each subaccount
        // If 10 consecutive subaccounts balances are zero, iteration stops
        if (basicSearch) {
          let zeros = 0;
          for (let i = 0; i < 1000; i++) {
            const myBalance = await balance({
              owner: myPrincipal,
              subaccount: new Uint8Array(getSubAccountArray(i)),
              certified: false,
            });
            if (Number(myBalance) > 0 || i === 0) {
              zeros = 0;
              subAccList.push({
                name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                sub_account_id: `0x${i.toString(16)}`,
                address: myPrincipal.toString(),
                amount: (Number(myBalance.toString()) / power).toString(),
                currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
                transaction_fee: (Number(myTransactionFee.toString()) / power).toString(),
                decimal: decimals,
                symbol: tkn.symbol,
              });
              userSubAcc.push({
                name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                numb: `0x${i.toString(16)}`,
              });
            } else zeros++;

            if (zeros === 10) break;
          }
        } else {
          // Non Basic Serach first look into storaged subaccounts
          // Then search into first 1000 subaccount that are not looked yet under the 10 consecutive zeros logic
          // It iterates geting amount of each subaccount
          // If 10 consecutive subaccounts balances are zero, iteration stops
          const idsPushed: string[] = [];
          await Promise.all(
            tkn.subAccounts.map(async (sa) => {
              const myBalance = await balance({
                owner: myPrincipal,
                subaccount: new Uint8Array(hexToUint8Array(sa.numb)),
                certified: false,
              });
              idsPushed.push(sa.numb);
              subAccList.push({
                name: sa.name,
                sub_account_id: sa.numb,
                address: myPrincipal.toString(),
                amount: (Number(myBalance.toString()) / power).toString(),
                currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
                transaction_fee: (Number(myTransactionFee.toString()) / power).toString(),
                decimal: decimals,
                symbol: tkn.symbol,
              });
              userSubAcc.push({
                name: sa.name,
                numb: sa.numb,
              });
            }),
          );
          let zeros = 0;
          for (let i = 0; i < 1000; i++) {
            if (!idsPushed.includes(`0x${i.toString(16)}`)) {
              const myBalance = await balance({
                owner: myPrincipal,
                subaccount: new Uint8Array(getSubAccountArray(i)),
                certified: false,
              });
              if (Number(myBalance) > 0 || i === 0) {
                zeros = 0;
                subAccList.push({
                  name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                  sub_account_id: `0x${i.toString(16)}`,
                  address: myPrincipal.toString(),
                  amount: (Number(myBalance.toString()) / power).toString(),
                  currency_amount: assetMarket
                    ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals)
                    : "0",
                  transaction_fee: (Number(myTransactionFee.toString()) / power).toString(),
                  decimal: decimals,
                  symbol: tkn.symbol,
                });
                userSubAcc.push({
                  name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                  numb: `0x${i.toString(16)}`,
                });
              } else zeros++;

              if (zeros === 10) break;
            }
          }
        }
        newTokens.push({
          ...tkn,
          logo: logo,
          decimal: decimals.toFixed(0),
          subAccounts: userSubAcc.sort((a, b) => {
            return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt()) || 0;
          }),
        });

        assets.push({
          symbol: tkn.symbol,
          name: tkn.name,
          address: tkn.address,
          index: tkn.index,
          subAccounts: subAccList.sort((a, b) => {
            return hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0;
          }),
          sort_index: tkn.id_number,
          decimal: decimals.toFixed(0),
          tokenName: name,
          tokenSymbol: symbol,
          logo: logo,
        });
      } catch (e) {
        assets.push({
          symbol: tkn.symbol,
          name: tkn.name,
          address: tkn.address,
          index: tkn.index,
          subAccounts: [
            {
              name: AccountDefaultEnum.Values.Default,
              sub_account_id: "0x0",
              address: myPrincipal.toString(),
              amount: "0",
              currency_amount: "0",
              transaction_fee: "0",
              decimal: 8,
              symbol: tkn.symbol,
            },
          ],
          decimal: "8",
          sort_index: 99999,
          tokenName: tkn.name,
          tokenSymbol: tkn.symbol,
        });
        newTokens.push(tkn);
      }
    }),
  );

  if (loading) {
    store.dispatch(setAssets(assets));
    if (newTokens.length !== 0) {
      localStorage.setItem(
        myPrincipal.toString(),
        JSON.stringify({
          from: "II",
          tokens: newTokens.sort((a, b) => {
            return a.id_number - b.id_number;
          }),
        }),
      );
    }
  }

  const icpAsset = assets.find((ast) => ast.tokenSymbol === "ICP");
  if (icpAsset) {
    const sub: ICPSubAccount[] = [];
    icpAsset.subAccounts.map((saICP) => {
      let subacc: SubAccountNNS | undefined = undefined;
      try {
        subacc = SubAccountNNS.fromBytes(hexToUint8Array(saICP.sub_account_id)) as SubAccountNNS;
      } catch {
        subacc = undefined;
      }
      sub.push({
        legacy: AccountIdentifier.fromPrincipal({
          principal: myPrincipal,
          subAccount: subacc,
        }).toHex(),
        sub_account_id: saICP.sub_account_id,
      });
    });

    store.dispatch(setICPSubaccounts(sub));
  }
  return {
    assets,
    tokens: newTokens.sort((a, b) => {
      return a.id_number - b.id_number;
    }),
  };
};

export const getAllTransactionsICP = async (subaccount_index: string, loading: boolean) => {
  const myAgent = store.getState().auth.userAgent;
  const myPrincipal = await myAgent.getPrincipal();
  let subacc: SubAccountNNS | undefined = undefined;
  try {
    subacc = SubAccountNNS.fromBytes(hexToUint8Array(subaccount_index)) as SubAccountNNS;
  } catch {
    subacc = undefined;
  }

  const accountIdentifier = AccountIdentifier.fromPrincipal({
    principal: myPrincipal,
    subAccount: subacc,
  });
  try {
    const response = await fetch(`${import.meta.env.VITE_ROSETTA_URL}/search/transactions`, {
      method: "POST",
      body: JSON.stringify({
        network_identifier: {
          blockchain: import.meta.env.VITE_NET_ID_BLOCKCHAIN,
          network: import.meta.env.VITE_NET_ID_NETWORK,
        },
        account_identifier: {
          address: accountIdentifier.toHex(),
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    if (!response.ok) throw Error(`${response.statusText}`);
    const { transactions } = await response.json();
    const transactionsInfo = transactions.map(({ transaction }: any) =>
      formatIcpTransaccion(accountIdentifier.toHex(), transaction),
    );

    if (loading) {
      store.dispatch(setTransactions(transactionsInfo));
    } else {
      return transactionsInfo;
    }
  } catch (error) {
    console.error("error", error);
    if (!loading) {
      return [];
    }
  }
};

export const getAllTransactionsICRC1 = async (
  canister_id: any,
  subaccount_index: Uint8Array,
  loading: boolean,
  assetSymbol: string,
  canister: string,
  subNumber?: string,
) => {
  const myAgent = store.getState().auth.userAgent;
  const myPrincipal = await myAgent.getPrincipal();
  const canisterPrincipal = Principal.fromText(canister_id);

  const { getTransactions: ICRC1_getTransactions } = IcrcIndexCanister.create({
    agent: myAgent,
    canisterId: canisterPrincipal,
  });

  const ICRC1getTransactions = await ICRC1_getTransactions({
    account: {
      owner: myPrincipal,
      subaccount: subaccount_index,
    } as IcrcAccount,
    max_results: BigInt(100),
  });

  const transactionsInfo = ICRC1getTransactions.transactions.map(({ transaction, id }) =>
    formatckBTCTransaccion(transaction, id, myPrincipal.toString(), assetSymbol, canister, subNumber),
  );
  if (
    loading &&
    store.getState().asset.selectedAccount?.sub_account_id === subNumber &&
    assetSymbol === store.getState().asset.selectedAsset?.tokenSymbol
  ) {
    store.dispatch(setTransactions(transactionsInfo));
    return transactionsInfo;
  } else {
    return transactionsInfo;
  }
};
