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

<<<<<<< HEAD
  if (!myPrincipal) {
    logger.debug("No principal found");
    return;
=======
  await Promise.all(
    tokens.map(async (tkn, idNum) => {
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
          sort_index: idNum,
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
          sort_index: 99999 + idNum,
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
>>>>>>> 8eb3d425 (open index by asset sort index)
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
