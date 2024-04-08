import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TokenMarketInfo } from "@redux/models/TokenModels";
import { Asset, ICPSubAccount, SubAccount, Transaction, TransactionList } from "@redux/models/AccountModels";
import { getUSDfromToken } from "@/utils";
import { ICRC1systemAssets } from "@/defaultTokens";

interface AssetState {
  initLoad: boolean;
  assetLoading: boolean;
  txLoad: boolean;
  ICPSubaccounts: Array<ICPSubAccount>;
  icr1SystemAssets: Asset[];
  tokensMarket: TokenMarketInfo[];
  assets: Array<Asset>;
  accounts: Array<SubAccount>;
  accordionIndex: string[];
  selectedAsset: Asset | undefined;
  selectedAccount: SubAccount | undefined;
  selectedTransaction: Transaction | undefined;
  txWorker: Array<TransactionList>;
}

const initialState: AssetState = {
  initLoad: true,
  assetLoading: false,
  ICPSubaccounts: [],
  icr1SystemAssets: ICRC1systemAssets,
  tokensMarket: [],
  assets: [],
  accounts: [],
  accordionIndex: [],
  selectedAsset: undefined,
  selectedAccount: undefined,
  selectedTransaction: undefined,
  txWorker: [],
  txLoad: false,
};

const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setInitLoad(state, action: PayloadAction<boolean>) {
      state.initLoad = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.assetLoading = action.payload;
    },
    setICRC1SystemAssets(state, action: PayloadAction<Asset[]>) {
      state.icr1SystemAssets = [...ICRC1systemAssets, ...action.payload];
    },
    setICPSubaccounts(state, action: PayloadAction<ICPSubAccount[]>) {
      state.ICPSubaccounts = action.payload;
    },
    removeAsset(state, action: PayloadAction<string>) {
      const { payload: symbolToRemove } = action;
      const auxAssets = state.assets.filter((asset) => asset.tokenSymbol !== symbolToRemove);
      state.assets = auxAssets;
    },
    updateAsset: {
      reducer(
        state,
        action: PayloadAction<{
          asset: Asset;
          tokenSymbol: string;
        }>,
      ) {
        const { asset, tokenSymbol } = action.payload;
        const auxAssets = state.assets.map((asst) => {
          if (asst.tokenSymbol === tokenSymbol) {
            return {
              ...asst,
              symbol: asset.symbol,
              name: asset.name,
              index: asset.index,
              shortDecimal:
                asset.shortDecimal === "" ? Number(asset.decimal).toFixed() : Number(asset.shortDecimal).toFixed(),
            };
          } else return asst;
        });
        state.assets = auxAssets;
      },
      prepare(asset: Asset, tokenSymbol: string) {
        return {
          payload: { asset, tokenSymbol },
        };
      },
    },
    updateSubAccountBalance: {
      reducer(
        state: AssetState,
        { payload }: PayloadAction<{ tokenSymbol: string; subAccountId: string; amount: string }>,
      ) {
        const { tokenSymbol, subAccountId, amount } = payload;
        const assetIndex = state.assets.findIndex((asset) => asset.tokenSymbol === tokenSymbol);

        const marketPrince = state.tokensMarket.find((tokenMarket) => tokenMarket.symbol === tokenSymbol)?.price || "0";
        const decimals = state.assets.find((asset) => asset.tokenSymbol === tokenSymbol)?.decimal;
        const USDAmount = marketPrince ? getUSDfromToken(amount, marketPrince, Number(decimals)) : "0";

        if (assetIndex !== -1 && state.assets[assetIndex]) {
          const newAssetSubAccounts = state.assets[assetIndex].subAccounts.map((subAccount) => {
            if (subAccount.sub_account_id === subAccountId) {
              return {
                ...subAccount,
                amount,
                currency_amount: USDAmount,
              };
            }
            return subAccount;
          });

          state.assets[assetIndex].subAccounts = newAssetSubAccounts;
        }
      },
      prepare(tokenSymbol: string, subAccountId: string, amount: string) {
        return { payload: { tokenSymbol, subAccountId, amount } };
      },
    },
    setSubAccountName: {
      reducer(
        state,
        action: PayloadAction<{
          assetIndex: number | string;
          subaccountId: number | string;
          name: string;
        }>,
      ) {
        const { assetIndex, subaccountId, name } = action.payload;

        if (state.assets[Number(assetIndex)] && state.assets[Number(assetIndex)].subAccounts[Number(subaccountId)])
          state.assets[Number(assetIndex)].subAccounts[Number(subaccountId)].name = name;
      },
      prepare(assetIndex: string | number, subaccountId: string | number, name: string) {
        return {
          payload: { assetIndex, subaccountId, name },
        };
      },
    },
    setTokenMarket(state, action: PayloadAction<TokenMarketInfo[]>) {
      state.tokensMarket = action.payload;
    },
    addSubAccount: {
      reducer(
        state,
        action: PayloadAction<{
          assetIndex: number | string;
          subaccount: SubAccount;
        }>,
      ) {
        const { assetIndex, subaccount } = action.payload;
        if (state.assets[Number(assetIndex)]) {
          state.assets[Number(assetIndex)].subAccounts.push(subaccount);
          state.assets[Number(assetIndex)].subAccounts.sort((a, b) => {
            return Number(a.sub_account_id) - Number(b.sub_account_id);
          });
        }
      },
      prepare(assetIndex: string | number, subaccount: SubAccount) {
        return {
          payload: { assetIndex, subaccount },
        };
      },
    },
    setAssets(state, action) {
      state.assets = action.payload.sort((a: Asset, b: Asset) => {
        return a.sortIndex - b.sortIndex;
      });
    },
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
    setSelectedAsset(state, action) {
      state.selectedAsset = action.payload;
    },
    setSelectedAccount(state, action) {
      state.selectedAccount = action.payload;
    },
    setSelectedTransaction(state, action) {
      state.selectedTransaction = action.payload;
    },
    setAccordionAssetIdx(state, action: PayloadAction<string[]>) {
      state.accordionIndex = action.payload;
    },
    clearDataAsset(state) {
      (state.initLoad = true), (state.ICPSubaccounts = []);
      state.tokensMarket = [];
      state.accounts = [];
      state.assets = [];
      state.txWorker = [];
      state.selectedAccount = undefined;
      state.selectedAsset = undefined;
      state.selectedTransaction = undefined;
      state.accordionIndex = [];
      state.icr1SystemAssets = ICRC1systemAssets;
    },
    // INFO: service worker state reducers
    setTxWorker(state, action) {
      const txList = [...state.txWorker];

      const idx = txList.findIndex((tx: TransactionList) => {
        return tx.symbol === action.payload.symbol && tx.subaccount === action.payload.subaccount;
      });
      const auxTx = txList.find((tx: TransactionList) => {
        return tx.symbol === action.payload.symbol && tx.subaccount === action.payload.subaccount;
      });

      if (!auxTx) {
        txList.push(action.payload);
      } else {
        txList[idx] = action.payload;
      }

      state.txWorker = txList;
    },
    addTxWorker(state, action: PayloadAction<TransactionList>) {
      state.txWorker = [...state.txWorker, action.payload];
    },
  },
});

export const {
  setInitLoad,
  clearDataAsset,
  setICRC1SystemAssets,
  setICPSubaccounts,
  setLoading,
  removeAsset,
  updateAsset,
  setTokenMarket,
  setSubAccountName,
  addSubAccount,
  setAssets,
  setAccounts,
  setSelectedAsset,
  setSelectedAccount,
  setSelectedTransaction,
  setTxWorker,
  addTxWorker,
  setAccordionAssetIdx,
  updateSubAccountBalance,
} = assetSlice.actions;

export default assetSlice.reducer;
