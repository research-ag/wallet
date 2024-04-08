import { RefreshOptions } from "@/@types/assets";
import { getMetadataInfo, getUSDfromToken, hexToNumber, hexToUint8Array } from "@/utils";
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
  const { myAgent, tokenMarkets, myPrincipal } = options;

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

      const USDAmount = assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0";

      const assetSubAccount: SubAccount = {
        name: currentSubAccount.name,
        sub_account_id: currentSubAccount.sub_account_id?.toString(),
        address: myPrincipal?.toString(),
        amount,
        currency_amount: USDAmount,
        transaction_fee: myTransactionFee.toString(),
        decimal: decimals,
        symbol: asset.symbol,
      };

      loadedSubAccountsIds.push(currentSubAccount.sub_account_id);
      return assetSubAccount;
    }),
  );

  // TODO: sub account is not necessarily at this point, for the break if 5 zeros in a row

  // for (let index = 0; index < 1000; index++) {
  //   if (!loadedSubAccountsIds.includes(`0x${index.toString(16)}`)) {
  //     const myBalance = await balance({
  //       owner: myPrincipal,
  //       subaccount: new Uint8Array(getSubAccountArray(index)),
  //       certified: false,
  //     });

  //     if (Number(myBalance) > 0) {
  //       const amount = myBalance.toString();
  //       const USDAmount = assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0";

  //       const assetSubAccount: SubAccount = {
  //         name: index === 0 ? AccountDefaultEnum.Values.Default : "-",
  //         sub_account_id: `0x${index.toString(16)}`,
  //         address: myPrincipal?.toString(),
  //         amount,
  //         currency_amount: USDAmount,
  //         transaction_fee: myTransactionFee.toString(),
  //         decimal: decimals,
  //         symbol: asset.symbol,
  //       };

  //       assetSubAccounts.push(assetSubAccount);
  //     }
  //   }
  // }

  const updatedAsset: Asset = {
    symbol: asset.symbol,
    name: asset.name,
    address: asset.address,
    index: asset.index,
    subAccounts: sortSubAccounts(assetSubAccounts),
    // INFO: sortIndex: idNum,
    sortIndex: asset.sortIndex,
    decimal: decimals.toFixed(0),
    shortDecimal: asset.shortDecimal || decimals.toFixed(0),
    tokenName: name,
    tokenSymbol: symbol,
    logo: getFirstNonEmptyString(logo, asset?.logo || ""),
    supportedStandards: asset.supportedStandards,
  };

  return updatedAsset;
}

export async function refreshAssetBalances(assets: Asset[], options: RefreshOptions) {
  const result = await Promise.all(assets.map((asset: Asset) => refreshAsset(asset, options)));
  return result;
}

// -------------------------------------------------------------------------------------------------

// TODO: remove this functions once the new refreshAssetBalances is tested and migrated entirely
// async function refreshAssetBalancesOld(assets: Asset[], options: RefreshOptions) {
//   const { myAgent, basicSearch = false, tokenMarkets, myPrincipal } = options;

//   return await Promise.all(
//     assets.map(async (currentAsset, idNum) => {
//       try {
//         const { balance, metadata, transactionFee } = IcrcLedgerCanister.create({
//           agent: myAgent,
//           canisterId: Principal.fromText(currentAsset.address),
//         });

//         const [myMetadata, myTransactionFee] = await Promise.all([
//           metadata({ certified: false }),
//           transactionFee({ certified: false }),
//         ]);

//         const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);

//         const assetMarket = tokenMarkets.find((tokenMarket) => tokenMarket.symbol === symbol);
//         //
//         const subAccList: SubAccount[] = [];
//         let assetSubAccounts: SubAccount[] = [];

//         // INFO: search for the first 1000 subaccounts looking for positive balances
//         if (basicSearch) {
//           let zeros = 0;
//           for (let basicSearchIndex = 0; basicSearchIndex < 1000; basicSearchIndex++) {
//             const myBalance = await balance({
//               owner: myPrincipal,
//               subaccount: new Uint8Array(getSubAccountArray(basicSearchIndex)),
//               certified: false,
//             });

//             if (Number(myBalance) > 0 || basicSearchIndex === 0) {
//               zeros = 0;

//               subAccList.push({
//                 name: basicSearchIndex === 0 ? AccountDefaultEnum.Values.Default : "-",
//                 sub_account_id: `0x${basicSearchIndex.toString(16)}`,
//                 address: myPrincipal?.toString(),
//                 amount: myBalance.toString(),
//                 currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
//                 transaction_fee: myTransactionFee.toString(),
//                 decimal: decimals,
//                 symbol: currentAsset.symbol,
//               });
//             } else zeros++;

//             if (zeros === 5) break;
//           }
//         } else {
//           // INFO: first refresh the balance of existing subaccounts
//           // INFO: second check if a non-existing subaccount has a balance
//           const idsPushed: string[] = [];

//           assetSubAccounts = await Promise.all(
//             currentAsset.subAccounts.map(async (sa) => {
//               const myBalance = await balance({
//                 owner: myPrincipal,
//                 subaccount: new Uint8Array(hexToUint8Array(sa.sub_account_id)),
//                 certified: false,
//               });
//               idsPushed.push(sa.sub_account_id);
//               const amount = myBalance.toString();

//               const USDAmount = assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0";

//               const assetSubAccount: SubAccount = {
//                 name: sa.name,
//                 sub_account_id: sa.sub_account_id,
//                 address: myPrincipal?.toString(),
//                 amount,
//                 currency_amount: USDAmount,
//                 transaction_fee: myTransactionFee.toString(),
//                 decimal: decimals,
//                 symbol: currentAsset.symbol,
//               };

//               return assetSubAccount;
//             }),
//           );

//           let zeros = 0;
//           for (let i = 0; i < 1000; i++) {
//             if (!idsPushed.includes(`0x${i.toString(16)}`)) {
//               const myBalance = await balance({
//                 owner: myPrincipal,
//                 subaccount: new Uint8Array(getSubAccountArray(i)),
//                 certified: false,
//               });

//               if (Number(myBalance) > 0 || i === 0) {
//                 zeros = 0;
//                 const amount = myBalance.toString();
//                 const USDAmount = assetMarket
//                   ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals)
//                   : "0";

//                 const assetSubAccount: SubAccount = {
//                   name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
//                   sub_account_id: `0x${i.toString(16)}`,
//                   address: myPrincipal?.toString(),
//                   amount,
//                   currency_amount: USDAmount,
//                   transaction_fee: myTransactionFee.toString(),
//                   decimal: decimals,
//                   symbol: currentAsset.symbol,
//                 };

//                 assetSubAccounts.push(assetSubAccount);
//               } else zeros++;

//               if (zeros === 5) break;
//             }
//           }
//         }

//         const newAsset: Asset = {
//           symbol: currentAsset.symbol,
//           name: currentAsset.name,
//           address: currentAsset.address,
//           index: currentAsset.index,
//           subAccounts: sortSubAccounts(basicSearch ? subAccList : assetSubAccounts),
//           sortIndex: idNum,
//           decimal: decimals.toFixed(0),
//           shortDecimal: currentAsset.shortDecimal || decimals.toFixed(0),
//           tokenName: name,
//           tokenSymbol: symbol,
//           logo: getFirstNonEmptyString(logo, currentAsset?.logo || ""),
//           supportedStandards: currentAsset.supportedStandards,
//         };

//         return { newAsset };
//       } catch (e) {
//         const newAsset: Asset = {
//           symbol: currentAsset.symbol,
//           name: currentAsset.name,
//           address: currentAsset.address,
//           index: currentAsset.index,
//           subAccounts: [
//             {
//               name: AccountDefaultEnum.Values.Default,
//               sub_account_id: "0x0",
//               address: myPrincipal?.toString(),
//               amount: "0",
//               currency_amount: "0",
//               transaction_fee: "0",
//               decimal: 8,
//               symbol: currentAsset.symbol,
//             },
//           ],
//           decimal: "8",
//           shortDecimal: "8",
//           sortIndex: 99999 + idNum,
//           tokenName: currentAsset.name,
//           tokenSymbol: currentAsset.symbol,
//           supportedStandards: currentAsset.supportedStandards,
//         };
//         return { newAsset };
//       }
//     }),
//   );
// }
