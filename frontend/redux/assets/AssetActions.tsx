import store from "@redux/Store";
import { SnsToken } from "@redux/models/TokenModels";
import { IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";
import { setTokenMarket, setICPSubaccounts, setAccordionAssetIdx, setAssets } from "./AssetReducer";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Asset, ICPSubAccount } from "@redux/models/AccountModels";
import { UpdateAllBalances } from "@/@types/assets";
import { getICRCSupportedStandards } from "@/common/libs/icrc";
import { HttpAgent } from "@dfinity/agent";
import { getETHRate, getTokensFromMarket } from "@/common/utils/market";
import { refreshAssetBalances } from "@pages/home/helpers/assets";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getMetadataInfo } from "@common/utils/icrc";

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

  store.dispatch(setAssets(newAssetsUpload));

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
