import { AssetSymbolEnum } from "@common/const";
import { Asset } from "@redux/models/AccountModels";
import store from "@redux/Store";
import { setTxWorker } from "@redux/transaction/TransactionReducer";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "./requests";
import { hexToUint8Array } from "@common/utils/hexadecimal";

async function fetchICPTransactions(asset: Asset) {
  const txTransactions = [];

  for (const subAccount of asset.subAccounts) {
    const transactions = await getAllTransactionsICP({
      subaccount_index: subAccount.sub_account_id,
      isOGY: asset.tokenSymbol === AssetSymbolEnum.Enum.OGY,
    });

    txTransactions.push({
      tx: transactions,
      symbol: asset.symbol,
      tokenSymbol: asset.tokenSymbol,
      subaccount: subAccount.sub_account_id,
    });
  }

  return txTransactions;
}

async function fetchICRC1Transactions(asset: Asset, selectedToken: Asset) {
  const txTransactions = [];

  for (const subAccount of asset.subAccounts) {
    const transactions = await getAllTransactionsICRC1({
      canisterId: selectedToken.index || "",
      subaccount_index: hexToUint8Array(subAccount.sub_account_id || "0x0"),
      assetSymbol: asset.tokenSymbol,
      canister: selectedToken.address,
      subNumber: subAccount.sub_account_id,
    });

    txTransactions.push({
      tx: transactions,
      symbol: asset.symbol,
      tokenSymbol: asset.tokenSymbol,
      subaccount: subAccount.sub_account_id,
    });
  }

  return txTransactions;
}

export async function transactionCacheRefresh(assets: Asset[]) {
  try {
    const txWorker = [];

    for (const asset of assets) {
      if (asset.tokenSymbol === AssetSymbolEnum.Enum.ICP || asset.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
        const transactionsBySubAccounts = await fetchICPTransactions(asset);
        txWorker.push(...transactionsBySubAccounts);
      } else {
        const selectedAsset = assets.find((currentAsset) => currentAsset.symbol === asset.symbol);
        if (selectedAsset) {
          const transactoinsBySubaccount = await fetchICRC1Transactions(asset, selectedAsset);
          txWorker.push(...transactoinsBySubaccount);
        }
      }
    }

    console.log("tx Worker Completed", txWorker);
    store.dispatch(setTxWorker(txWorker));
  } catch (error) {
    console.error("Error in transactionCacheRefresh worker", error);
  }
}
