import store from "@redux/Store";
import { SnsToken } from "@redux/models/TokenModels";
import { IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";
import {
  setTokenMarket,
  setICPSubaccounts,
  setAssets,
  setSelectedAsset,
  setSelectedAccount,
} from "@/redux/assets/AssetReducer";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Asset, ICPSubAccount } from "@redux/models/AccountModels";
import { UpdateAllBalances } from "@/@types/assets";
import ICRC1SupportedStandards from "@/common/libs/icrcledger/ICRC1SupportedStandards";
import { HttpAgent } from "@dfinity/agent";
import { getETHRate, getTokensFromMarket, getckUSDCRate } from "@/common/utils/market";
import { refreshAssetBalances } from "@pages/home/helpers/assets";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getMetadataInfo } from "@common/utils/icrc";
import logger from "@/common/utils/logger";

<<<<<<< HEAD
/**
 * This function updates the balances for all provided assets and their subaccounts, based on the market price and the account balance.
 *
 * @param params An object containing parameters for the update process.
 * @returns An object containing updated `newAssetsUpload` and `assets` arrays.
 */
export const updateAllBalances: UpdateAllBalances = async (params) => {
  const { myAgent = store.getState().auth.userAgent, assets, basicSearch = false } = params;

  const tokenMarkets = await getTokensFromMarket();
  const ckETHRate = await getETHRate();
  const ckUSDCRate = await getckUSDCRate();
  if (ckETHRate) tokenMarkets.push(ckETHRate);
  tokenMarkets.push(ckUSDCRate);
  store.dispatch(setTokenMarket(tokenMarkets));
=======
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
          symbol: "ckETH",
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
>>>>>>> 870ab8ce (fetch eth market value)

  const auxAssets = [...assets].sort((a, b) => a.sortIndex - b.sortIndex);
  const myPrincipal = store.getState().auth.userPrincipal;

  if (!myPrincipal) {
    logger.debug("No principal found");
    return;
  }

  const updateAssets = await refreshAssetBalances(auxAssets, {
    myAgent,
    basicSearch,
    tokenMarkets,
    myPrincipal,
  });

  const newAssetsUpload = updateAssets.sort((a, b) => a.sortIndex - b.sortIndex);
  store.dispatch(setAssets(newAssetsUpload));
  const icpAsset = newAssetsUpload.find((asset) => asset.tokenSymbol === "ICP");

  //
  const currentSelectedAsset = store.getState().asset.helper.selectedAsset;
  const currentSelectedAccount = store.getState().asset.helper.selectedAccount;
  const newSelectedAsset = newAssetsUpload.find((asset) => asset.tokenSymbol === currentSelectedAsset?.tokenSymbol);
  const newSelectedAccount = newSelectedAsset?.subAccounts.find(
    (subAccount) => subAccount.sub_account_id === currentSelectedAccount?.sub_account_id,
  );

  store.dispatch(setSelectedAsset(newSelectedAsset));
  store.dispatch(setSelectedAccount(newSelectedAccount));
  //

  if (icpAsset) {
    const sub: ICPSubAccount[] = [];

    icpAsset.subAccounts.map((saICP) => {
      let subacc: SubAccountNNS | undefined = undefined;

      try {
        subacc = SubAccountNNS.fromBytes(hexToUint8Array(saICP.sub_account_id)) as SubAccountNNS;
      } catch (error) {
        logger.debug("Error parsing subaccount", error);
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
      logger.debug("snses", error);
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

        const supportedStandards = await ICRC1SupportedStandards({
          canisterId: tkn.canister_ids.ledger_canister_id,
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
              symbol: metadata.symbol,
            },
          ],
          supportedStandards: supportedStandards,
        });
      }
    }),
<<<<<<< HEAD
  );

  return deduplicatedTokens.reverse();
=======
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
  symbol: string,
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
>>>>>>> 131bad97 (fix on clic functions in line)
};
