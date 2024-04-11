import store from "@redux/Store";
import { SnsToken } from "@redux/models/TokenModels";

import { IcrcAccount, IcrcIndexCanister, IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";

import { formatIcpTransaccion, getMetadataInfo, formatckBTCTransaccion, hexToUint8Array } from "@/utils";

import { setTokenMarket, setICPSubaccounts, setAccordionAssetIdx } from "./AssetReducer";

import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Asset, ICPSubAccount } from "@redux/models/AccountModels";

import { Principal } from "@dfinity/principal";
import { getETHRate, getTokensFromMarket } from "@/utils/market";
import { GetAllTransactionsICPParams, UpdateAllBalances } from "@/@types/assets";
import { getICRCSupportedStandards } from "@pages/home/helpers/icrc";
import { HttpAgent } from "@dfinity/agent";
import { refreshAssetBalances } from "@/utils/assets";
import { setTransactions } from "@redux/transaction/TransactionReducer";
import { db } from "@/database/db";

/**
 * This function updates the balances for all provided assets and their subaccounts, based on the market price and the account balance.
 *
 * @param params An object containing parameters for the update process.
 * @returns An object containing updated `newAssetsUpload` and `assets` arrays.
 */
export const updateAllBalances: UpdateAllBalances = async (params) => {
  const { loading, myAgent = store.getState().auth.userAgent, assets, basicSearch = false, fromLogin } = params;

  const tokenMarkets = await getTokensFromMarket();
  const ETHRate = await getETHRate();
  if (ETHRate) tokenMarkets.push(ETHRate);
  store.dispatch(setTokenMarket(tokenMarkets));

  const auxAssets = [...assets].sort((a, b) => a.sortIndex - b.sortIndex);
  const myPrincipal = store.getState().auth.userPrincipal;

  if (!myPrincipal) {
    console.warn("No principal found");
    return;
  }

  const updateAssets = await refreshAssetBalances(auxAssets, {
    myAgent,
    basicSearch,
    tokenMarkets,
    myPrincipal,
  });

  const newAssetsUpload = updateAssets.sort((a, b) => a.sortIndex - b.sortIndex);
  await db().updateAssets(newAssetsUpload, { sync: true });

  if (loading) {
    if (fromLogin) {
      newAssetsUpload.length > 0 && store.dispatch(setAccordionAssetIdx([newAssetsUpload[0].tokenSymbol]));
    }
  }

  const icpAsset = newAssetsUpload.find((asset) => asset.tokenSymbol === "ICP");

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
