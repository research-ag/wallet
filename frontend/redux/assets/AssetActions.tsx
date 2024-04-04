import store from "@redux/Store";
import { SnsToken } from "@redux/models/TokenModels";

import {
  IcrcAccount,
  IcrcIndexCanister,
  IcrcLedgerCanister,
  IcrcTokenMetadataResponse,
} from "@dfinity/ledger-icrc";

import {
  formatIcpTransaccion,
  getSubAccountArray,
  getMetadataInfo,
  formatckBTCTransaccion,
  getUSDfromToken,
  hexToUint8Array,
} from "@/utils";

import {
  setAssets,
  setTransactions,
  setTokenMarket,
  setICPSubaccounts,
  setAccordionAssetIdx,
  // setAccordionAssetIdx
} from "./AssetReducer";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import {
  Asset,
  ICPSubAccount,
  SubAccount,
} from "@redux/models/AccountModels";
import { Principal } from "@dfinity/principal";
import { AccountDefaultEnum } from "@/const";
import { getETHRate, getTokensFromMarket } from "@/utils/market";
import { GetAllTransactionsICPParams, UpdateAllBalances } from "@/@types/assets";
import { getICRCSupportedStandards } from "@pages/home/helpers/icrc";
import { HttpAgent } from "@dfinity/agent";
import { getFirstNonEmptyString, sortSubAccounts } from "@/utils/assets";

/**
 * This function updates the balances for all provided tokens and their subaccounts, based on the market price and the account balance.
 *
 * @param params An object containing parameters for the update process.
 * @returns An object containing updated `newAssetsUpload` and `tokens` arrays.
 */
export const updateAllBalances: UpdateAllBalances = async (params) => {

  const {
    loading,
    myAgent = store.getState().auth.userAgent,
    assets,
    basicSearch = false,
    fromLogin } = params;

  const tokenMarkets = await getTokensFromMarket();
  const ETHRate = await getETHRate();
  if (ETHRate) tokenMarkets.push(ETHRate);
  store.dispatch(setTokenMarket(tokenMarkets));

  const auxAssets = [...assets].sort((a, b) => a.sortIndex - b.sortIndex);
  const myPrincipal = store.getState().auth.userPrincipal;

  if (!myPrincipal) {
    console.warn("No principal found");
    return;
  };

  // const tokensAseets = await Promise.all(
  const updateAssets = await Promise.all(
    auxAssets.map(async (currentAsset, idNum) => {
      try {
        const { balance, metadata, transactionFee } = IcrcLedgerCanister.create({
          agent: myAgent,
          canisterId: Principal.fromText(currentAsset.address),
        });


        const [myMetadata, myTransactionFee] = await Promise.all([
          metadata({ certified: false }),
          transactionFee({ certified: false }),
        ]);

        const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);

        const assetMarket = tokenMarkets.find((tokenMarket) => tokenMarket.symbol === symbol);
        const subAccList: SubAccount[] = [];
        // const userSubAcc: TokenSubAccount[] = [];
        let subAccts: { assetSubAccount: SubAccount }[] = [];

        // Basic Serach look into first 1000 subaccount under the 5 consecutive zeros logic
        // It iterates geting amount of each subaccount
        // If 5 consecutive subaccounts balances are zero, iteration stops
        if (basicSearch) {
          // TODO: basic search later
          // let zeros = 0;
          // for (let basicSearchIndex = 0; basicSearchIndex < 1000; basicSearchIndex++) {

          //   const myBalance = await balance({
          //     owner: myPrincipal,
          //     subaccount: new Uint8Array(getSubAccountArray(basicSearchIndex)),
          //     certified: false,
          //   });

          //   if (Number(myBalance) > 0 || basicSearchIndex === 0) {
          //     zeros = 0;

          //     subAccList.push({
          //       name: basicSearchIndex === 0 ? AccountDefaultEnum.Values.Default : "-",
          //       sub_account_id: `0x${basicSearchIndex.toString(16)}`,
          //       address: myPrincipal?.toString(),
          //       amount: myBalance.toString(),
          //       currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
          //       transaction_fee: myTransactionFee.toString(),
          //       decimal: decimals,
          //       symbol: currentAsset.symbol,
          //     });

          //     userSubAcc.push({
          //       name: basicSearchIndex === 0 ? AccountDefaultEnum.Values.Default : "-",
          //       numb: `0x${basicSearchIndex.toString(16)}`,
          //       amount: myBalance.toString(),
          //       currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
          //     });

          //   } else zeros++;

          //   if (zeros === 5) break;
          // }
        } else {
          // Non Basic Serach first look into storaged subaccounts
          // Then search into first 1000 subaccount that are not looked yet under the 5 consecutive zeros logic
          // It iterates geting amount of each subaccount
          // If 5 consecutive subaccounts balances are zero, iteration stops

          // INFO: store the subaccounts that have been looked at
          const idsPushed: string[] = [];

          // INFO: get the market balance and usd conversion for each subaccount in currentAsset
          subAccts = await Promise.all(
            currentAsset.subAccounts.map(async (sa) => {
              // INFO: request to the ledger canister to get the balance of the subaccount
              const myBalance = await balance({
                owner: myPrincipal,
                subaccount: new Uint8Array(hexToUint8Array(sa.sub_account_id)),
                certified: false,
              });

              // INFO: push the subaccount id to the list of subaccounts that have been looked at
              idsPushed.push(sa.sub_account_id);

              // INFO: convert the BigInt balance to a string
              const amount = myBalance.toString();

              // INFO: if the asset has a market price, convert the balance to USD
              const USDAmount = assetMarket
                ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals)
                : "0";

              const assetSubAccount: SubAccount = {
                name: sa.name,
                sub_account_id: sa.sub_account_id,
                address: myPrincipal?.toString(),
                amount,
                currency_amount: USDAmount,
                transaction_fee: myTransactionFee.toString(),
                decimal: decimals,
                symbol: currentAsset.symbol,
              };

              // TODO: remove to avoid duplicated data
              // const saToken: TokenSubAccount = {
              //   name: sa.name,
              //   numb: sa.sub_account_id,
              //   amount,
              //   currency_amount: USDAmount,
              // };

              return { assetSubAccount };
            }),
          );


          let zeros = 0;
          // INFO: search for the first 1000 subaccounts that have not been looked at yet
          for (let i = 0; i < 1000; i++) {

            if (!idsPushed.includes(`0x${i.toString(16)}`)) {

              // INFO: request to the ledger canister to get the balance of the subaccount
              const myBalance = await balance({
                owner: myPrincipal,
                subaccount: new Uint8Array(getSubAccountArray(i)),
                certified: false,
              });

              // INFO: jump the default subaccount and if not balance is found
              if (Number(myBalance) > 0 || i === 0) {
                zeros = 0;

                // INFO: convert the BigInt balance to a string
                const amount = myBalance.toString();

                // INFO: if the asset has a market price, convert the balance to USD
                const USDAmount = assetMarket
                  ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals)
                  : "0";

                const assetSubAccount: SubAccount = {
                  name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                  sub_account_id: `0x${i.toString(16)}`,
                  address: myPrincipal?.toString(),
                  amount,
                  currency_amount: USDAmount,
                  transaction_fee: myTransactionFee.toString(),
                  decimal: decimals,
                  symbol: currentAsset.symbol,
                };

                // TODO: remove to avoid duplicated data
                // const saToken: TokenSubAccount = {
                //   name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                //   numb: `0x${i.toString(16)}`,
                //   amount,
                //   currency_amount: USDAmount,
                // };

                subAccts.push({ assetSubAccount });
              } else zeros++;

              if (zeros === 5) break;
            }
          }
        }

        // TODO: remove to avoid duplicated data
        // const saTokens = subAccts.map((saT) => saT.saToken);

        // INFO: sort the subaccounts by the subaccount id
        // TODO: not needed (probably)
        const assetSubAccounts = subAccts.map((sa) => sa.assetSubAccount);

        // TODO: remove to avoid duplicated data
        // const newToken: Asset = {
        //   ...currentAsset,
        //   logo: logo !== "" ? logo : currentAsset.logo && currentAsset.logo !== "" ? currentAsset.logo : "",
        //   tokenName: name,
        //   tokenSymbol: symbol,
        //   decimal: decimals.toFixed(0),
        //   subAccounts: (basicSearch ? userSubAcc : saTokens).sort((a, b) => {
        //     return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt()) || 0;
        //   }),
        //   supportedStandards: currentAsset.supportedStandards,
        // };

        // TODO: remove code smell
        // const newAsset: Asset = {
        //   symbol: currentAsset.symbol,
        //   name: currentAsset.name,
        //   address: currentAsset.address,
        //   index: currentAsset.index,
        //   subAccounts: (basicSearch ? subAccList : assetSubAccounts).sort((a, b) => {
        //     return hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0;
        //   }),
        //   sortIndex: idNum,
        //   decimal: decimals.toFixed(0),
        //   shortDecimal: currentAsset.shortDecimal || decimals.toFixed(0),
        //   tokenName: name,
        //   tokenSymbol: symbol,
        //   logo: logo !== ""
        //     ? logo
        //     : (currentAsset.logo && currentAsset.logo !== "")
        //       ? currentAsset.logo
        //       : "",
        //   supportedStandards: currentAsset.supportedStandards,
        // };

        const newAsset: Asset = {
          symbol: currentAsset.symbol,
          name: currentAsset.name,
          address: currentAsset.address,
          index: currentAsset.index,
          subAccounts: sortSubAccounts(basicSearch ? subAccList : assetSubAccounts),
          sortIndex: idNum,
          decimal: decimals.toFixed(0),
          shortDecimal: currentAsset.shortDecimal || decimals.toFixed(0),
          tokenName: name,
          tokenSymbol: symbol,
          logo: getFirstNonEmptyString(logo, currentAsset?.logo || ""),
          supportedStandards: currentAsset.supportedStandards,
        };

        return { newAsset };
      } catch (e) {
        const newAsset: Asset = {
          symbol: currentAsset.symbol,
          name: currentAsset.name,
          address: currentAsset.address,
          index: currentAsset.index,
          subAccounts: [
            {
              name: AccountDefaultEnum.Values.Default,
              sub_account_id: "0x0",
              address: myPrincipal?.toString(),
              amount: "0",
              currency_amount: "0",
              transaction_fee: "0",
              decimal: 8,
              symbol: currentAsset.symbol,
            },
          ],
          decimal: "8",
          shortDecimal: "8",
          sortIndex: 99999 + idNum,
          tokenName: currentAsset.name,
          tokenSymbol: currentAsset.symbol,
          supportedStandards: currentAsset.supportedStandards,
        };
        return { newAsset };
      }
    }),
  );


  // INFO: sort the assets by the sort index
  const newAssetsUpload = updateAssets
    .map((tA) => {
      return tA.newAsset;
    })
    .sort((a, b) => {
      return a.sortIndex - b.sortIndex;
    });

  // TODO: remove to avoid duplicated data
  // const newTokensUpload = tokensAseets
  //   .map((tA) => {
  //     return tA.newToken;
  //   })
  //   .sort((a, b) => {
  //     return a.id_number - b.id_number;
  //   });

  if (loading) {
    store.dispatch(setAssets(newAssetsUpload));

    if (fromLogin) {
      newAssetsUpload.length > 0 && store.dispatch(setAccordionAssetIdx([newAssetsUpload[0].tokenSymbol]));
    }
  }

  const icpAsset = newAssetsUpload.find((ast) => ast.tokenSymbol === "ICP");

  // INFO: if the ICP asset is found, update the subaccounts
  // INFO: ?????
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

  return newAssetsUpload;
  // return { newAssetsUpload: [], assets: [] };
};

// -----------------------------------------------------------------------------------------------

export const setAssetFromLocalData = (assets: Asset[], myPrincipal: string) => {
  const endAssets: Asset[] = [];

  assets.map((tkn) => {
    const subAccList: SubAccount[] = [];
    tkn.subAccounts?.map((sa) => {
      subAccList.push({
        name: sa.name,
        sub_account_id: sa.sub_account_id || "0",
        address: myPrincipal,
        amount: sa.amount || "0",
        currency_amount: sa.currency_amount || "0",
        transaction_fee: sa.transaction_fee || "0",
        decimal: Number(tkn.decimal),
        symbol: tkn.symbol,
      });
    });

    // endAssets.push({
    //   symbol: tkn.symbol,
    //   name: tkn.name,
    //   address: tkn.address,
    //   index: tkn.index,
    //   subAccounts: subAccList.sort((a, b) => {
    //     return hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0;
    //   }),
    //   sort_index: tkn.id_number,
    //   decimal: tkn.decimal,
    //   shortDecimal: tkn.shortDecimal || tkn.decimal,
    //   tokenName: tkn.tokenName,
    //   tokenSymbol: tkn.tokenSymbol,
    //   logo: tkn.logo,
    //   supportedStandards: tkn.supportedStandards,
    // });
  });

  store.dispatch(setAssets(endAssets));
};

export const getAllTransactionsICP = async (params: GetAllTransactionsICPParams) => {
  const { subaccount_index, loading, isOGY } = params;

  const myPrincipal = store.getState().auth.userPrincipal;
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
    const response = await fetch(
      `${isOGY ? import.meta.env.VITE_ROSETTA_URL_OGY : import.meta.env.VITE_ROSETTA_URL}/search/transactions`,
      {
        method: "POST",
        body: JSON.stringify({
          network_identifier: {
            blockchain: isOGY ? import.meta.env.VITE_NET_ID_BLOCKCHAIN_OGY : import.meta.env.VITE_NET_ID_BLOCKCHAIN,
            network: isOGY ? import.meta.env.VITE_NET_ID_NETWORK_OGY : import.meta.env.VITE_NET_ID_NETWORK,
          },
          account_identifier: {
            address: accountIdentifier.toHex(),
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      },
    ).catch();
    if (!response.ok) throw Error(`${response.statusText}`);
    const { transactions } = await response.json();
    const transactionsInfo = transactions.map(({ transaction, block_identifier }: any) =>
      formatIcpTransaccion(accountIdentifier.toHex(), transaction, block_identifier.hash),
    );

    if (loading) {
      store.dispatch(setTransactions(transactionsInfo));
    } else {
      return transactionsInfo;
    }
  } catch (error) {
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
  try {
    const myAgent = store.getState().auth.userAgent;
    const myPrincipal = store.getState().auth.userPrincipal;
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
      formatckBTCTransaccion(transaction, id, myPrincipal?.toString(), assetSymbol, canister, subNumber),
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
  } catch {
    return [];
  }
};

export const getSNSTokens = async (agent: HttpAgent): Promise<Asset[]> => {
  let tokens: SnsToken[] = [];

  for (let index = 0; index < 100; index++) {
    try {
      const response = await fetch(`https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/${index}/slow.json`);
      if (response.ok && response.status === 200) {
        const snses: SnsToken[] = await response.json();
        tokens = [...tokens, ...snses];
        if (snses.length < 10) break;
      } else {
        break;
      }
    } catch (error) {
      console.error("snses", error);
      break;
    }
  }

  const deduplicatedTokens: Asset[] = [];
  const symbolsAdded: string[] = [];

  await Promise.all(
    tokens.reverse().map(async (tkn, k) => {
      const metadata = getMetadataInfo(tkn.icrc1_metadata as IcrcTokenMetadataResponse);

      if (!symbolsAdded.includes(metadata.symbol)) {
        symbolsAdded.push(metadata.symbol);

        const supportedStandards = await getICRCSupportedStandards({
          assetAddress: tkn.canister_ids.ledger_canister_id,
          agent: agent,
        });

        deduplicatedTokens.push({
          sortIndex: 10005 + k,
          logo: metadata.logo !== "" ? metadata.logo : "https://3r4gx-wqaaa-aaaaq-aaaia-cai.ic0.app" + tkn.meta.logo,
          name: metadata.name,
          symbol: metadata.symbol,
          address: tkn.canister_ids.ledger_canister_id,
          decimal: metadata.decimals.toString(),
          shortDecimal: metadata.decimals.toString(),
          index: tkn.canister_ids.index_canister_id || "",
          tokenName: metadata.name,
          tokenSymbol: metadata.symbol,
          subAccounts: [
            {
              name: "Default",
              sub_account_id: "0",
              address: "",
              amount: "0",
              currency_amount: "0",
              transaction_fee: metadata.fee,
              decimal: 0,
              symbol: "",
            },
          ],
          supportedStandards: supportedStandards,
        });
      }
    }),
  );

  return deduplicatedTokens.reverse();
};
