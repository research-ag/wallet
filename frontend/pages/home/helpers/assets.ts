import { RefreshOptions } from "@/@types/assets";
import { AccountDefaultEnum } from "@/common/const";
import { getUSDFromToken } from "@common/utils/amount";
import { hexToNumber, hexToUint8Array } from "@common/utils/hexadecimal";
import { getMetadataInfo, getSubAccountArray } from "@common/utils/icrc";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import bigInt from "big-integer";

export function sortSubAccounts(subAccounts: SubAccount[]): SubAccount[] {
  return subAccounts.sort(
    (a, b) => hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0,
  );
}

export function getFirstNonEmptyString(...strings: string[]): string | undefined {
  return strings.find((str) => str !== "");
}

async function refreshAsset(asset: Asset, options: RefreshOptions) {
  try {
    const { myAgent, tokenMarkets, myPrincipal, basicSearch = false } = options;

    const { balance, metadata, transactionFee } = IcrcLedgerCanister.create({
      agent: myAgent,
      canisterId: Principal.fromText(asset.address),
    });

    const [myMetadata, myTransactionFee] = await Promise.all([
      metadata({ certified: false }),
      transactionFee({ certified: false }),
    ]);

    const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);
    const assetMarket = tokenMarkets.find((tokenMarket) => tokenMarket.symbol === symbol);

    const loadedSubAccountsIds: string[] = [];

    const assetSubAccounts: SubAccount[] = await Promise.all(
      asset.subAccounts.map(async (currentSubAccount) => {
        const myBalance = await balance({
          owner: myPrincipal,
          subaccount: new Uint8Array(hexToUint8Array(currentSubAccount.sub_account_id)),
          certified: false,
        });

        const amount = myBalance.toString();
        const USDAmount = assetMarket ? getUSDFromToken(myBalance.toString(), assetMarket.price, decimals) : "0";

        const assetSubAccount: SubAccount = {
          name: currentSubAccount.name,
          sub_account_id: currentSubAccount.sub_account_id?.toString(),
          address: myPrincipal?.toString(),
          amount,
          currency_amount: USDAmount,
          transaction_fee: myTransactionFee.toString(),
          decimal: decimals,
          symbol: asset.tokenSymbol,
        };

        loadedSubAccountsIds.push(currentSubAccount.sub_account_id);
        return assetSubAccount;
      }),
    );

    if (basicSearch) {
      let consecutiveEmptySubAccounts = 0;

      for (let index = 0; index < 1000 && consecutiveEmptySubAccounts < 5; index++) {
        const subAccountId = `0x${index.toString(16)}`;

        if (!loadedSubAccountsIds.includes(subAccountId)) {
          const myBalance = await balance({
            owner: myPrincipal,
            subaccount: new Uint8Array(getSubAccountArray(index)),
            certified: false,
          });

          if (Number(myBalance) > 0) {
            const amount = myBalance.toString();
            const USDAmount = assetMarket ? getUSDFromToken(amount, assetMarket.price, decimals) : "0";

            const assetSubAccount: SubAccount = {
              name: index === 0 ? AccountDefaultEnum.Values.Default : "-",
              sub_account_id: subAccountId,
              address: myPrincipal?.toString(),
              amount,
              currency_amount: USDAmount,
              transaction_fee: myTransactionFee.toString(),
              decimal: decimals,
              symbol: asset.tokenSymbol,
            };

            assetSubAccounts.push(assetSubAccount);
            consecutiveEmptySubAccounts = 0;
          } else {
            consecutiveEmptySubAccounts++;
          }
        }
      }
    }

    const updatedAsset: Asset = {
      symbol: asset.symbol,
      name: asset.name,
      address: asset.address,
      index: asset.index,
      subAccounts: sortSubAccounts(assetSubAccounts),
      sortIndex: asset.sortIndex,
      decimal: decimals.toFixed(0),
      shortDecimal: asset.shortDecimal || decimals.toFixed(0),
      tokenName: name,
      tokenSymbol: symbol,
      logo: getFirstNonEmptyString(logo, asset?.logo || ""),
      supportedStandards: asset.supportedStandards,
    };

    return updatedAsset;
  } catch {
    return asset;
  }
}

export async function refreshAssetBalances(assets: Asset[], options: RefreshOptions) {
  const result = await Promise.all(assets.map((asset: Asset) => refreshAsset(asset, options)));
  return result;
}

export function resetAssetAmount(assets: Asset[]) {
  return assets.map((asset) => ({
    ...asset,
    subAccounts: asset.subAccounts.map((subaccount) => ({
      ...subaccount,
      amount: "0",
      currency_amount: "0",
    })),
  }));
}
