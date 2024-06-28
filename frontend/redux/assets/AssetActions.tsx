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
  );

  return deduplicatedTokens.reverse();
};
