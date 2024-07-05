import { AssetSymbolEnum } from "@common/const";
import { Asset } from "@redux/models/AccountModels";
import store from "@redux/Store";
import { setTxWorker } from "@redux/transaction/TransactionReducer";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@/pages/home/helpers/requests";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import logger from "@/common/utils/logger";

async function fetchICPTransactions(asset: Asset) {
  const txTransactions = [];
  const promises = [];

  for (const subAccount of asset.subAccounts) {
    const params = {
      subaccount_index: subAccount.sub_account_id,
      isOGY: asset.tokenSymbol === AssetSymbolEnum.Enum.OGY,
    };

    promises.push(getAllTransactionsICP(params));
  }

  const transactions = await Promise.all(promises);

  for (let i = 0; i < transactions.length; i++) {
    txTransactions.push({
      tx: transactions[i],
      symbol: asset.symbol,
      tokenSymbol: asset.tokenSymbol,
      subaccount: asset.subAccounts[i].sub_account_id,
    });
  }

  return txTransactions;
}

async function fetchICRC1Transactions(asset: Asset, selectedToken: Asset) {
  const txTransactions = [];
  const promises = [];

  for (const subAccount of asset.subAccounts) {
    const params = {
      canisterId: selectedToken.index || "",
      subaccount_index: hexToUint8Array(subAccount.sub_account_id || "0x0"),
      assetSymbol: asset.tokenSymbol,
      canister: selectedToken.address,
      subNumber: subAccount.sub_account_id,
    };

    promises.push(getAllTransactionsICRC1(params));
  }

  const transactions = await Promise.all(promises);

  for (let i = 0; i < transactions.length; i++) {
    txTransactions.push({
      tx: transactions[i],
      symbol: asset.symbol,
      tokenSymbol: asset.tokenSymbol,
      subaccount: asset.subAccounts[i].sub_account_id,
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

    store.dispatch(setTxWorker(txWorker));
  } catch (error) {
    logger.debug("Error in transactionCacheRefresh worker", error);
  }
}
