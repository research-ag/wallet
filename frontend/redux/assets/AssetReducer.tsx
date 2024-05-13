import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TokenMarketInfo } from "@redux/models/TokenModels";
import { Asset, ICPSubAccount, SubAccount } from "@redux/models/AccountModels";
import { ICRC1systemAssets } from "@/common/defaultTokens";
import { getUSDFromToken } from "@common/utils/amount";

interface AssetStateHelper {
  initLoad: boolean;
  accordionIndex: string[];
  selectedAsset: Asset | undefined;
  selectedAccount: SubAccount | undefined;
}

interface AssetStateMutation {
  assetMutated?: Asset;
  assetAction: AssetMutationAction;
  assetResult: AssetMutationResult;
}

interface AssetStateUtilData {
  icr1SystemAssets: Asset[];
  tokensMarket: TokenMarketInfo[];
}

export enum AssetMutationAction {
  ADD_AUTOMATIC = "ADD_AUTOMATIC",
  ADD_MANUAL = "ADD_MANUAL",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  NONE = "NONE",
}

export enum AssetMutationResult {
  ADDING = "ADDING",
  ADDED = "ADDED",
  FAILED = "FAILED",
  NONE = "NONE",
}

interface AssetState {
  helper: AssetStateHelper;
  ICPSubaccounts: Array<ICPSubAccount>;
  accounts: Array<SubAccount>;
  utilData: AssetStateUtilData;
  mutation: AssetStateMutation;
  list: {
    assets: Array<Asset>;
  };
}

const initialState: AssetState = {
  helper: {
    accordionIndex: [],
    selectedAsset: undefined,
    selectedAccount: undefined,
    initLoad: true,
  },
  mutation: {
    assetMutated: undefined,
    assetAction: AssetMutationAction.NONE,
    assetResult: AssetMutationResult.NONE,
  },
  ICPSubaccounts: [],
  accounts: [],
  utilData: {
    tokensMarket: [],
    icr1SystemAssets: ICRC1systemAssets,
  },
  list: {
    assets: [],
  },
};

const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    // state helpers
    setInitLoad(state, action: PayloadAction<boolean>) {
      state.helper.initLoad = action.payload;
    },
    setAssetMutationResult(state, action: PayloadAction<AssetMutationResult>) {
      state.mutation.assetResult = action.payload;
    },
    setAssetMutation(state, action: PayloadAction<Asset | undefined>) {
      state.mutation.assetMutated = action.payload;
    },
    setAssetMutationAction(state, action: PayloadAction<AssetMutationAction>) {
      state.mutation.assetAction = action.payload;
    },
    setICRC1SystemAssets(state, action: PayloadAction<Asset[]>) {
      state.utilData.icr1SystemAssets = [...ICRC1systemAssets, ...action.payload];
    },
    setICPSubaccounts(state, action: PayloadAction<ICPSubAccount[]>) {
      state.ICPSubaccounts = action.payload;
    },
    setTokenMarket(state, action: PayloadAction<TokenMarketInfo[]>) {
      state.utilData.tokensMarket = action.payload;
    },
    // asset reducers
    setAssets(state, action) {
      state.list.assets = action.payload.sort((a: Asset, b: Asset) => a.sortIndex - b.sortIndex);
    },
    addReduxAsset(state: AssetState, action: PayloadAction<Asset>) {
      state.list.assets = [...state.list.assets, action.payload];
    },
    updateReduxAsset(state: AssetState, action: PayloadAction<Asset>) {
      const assetIndex = state.list.assets.findIndex((asset) => asset.tokenSymbol === action.payload.tokenSymbol);

      if (assetIndex !== -1) state.list.assets[assetIndex] = action.payload;
    },
    deleteReduxAsset(state: AssetState, action: PayloadAction<string>) {
      state.list.assets = state.list.assets.filter((asset) => asset.address !== action.payload);
    },
    // sub accounts reducers
    updateSubAccountBalance: {
      reducer(
        state: AssetState,
        { payload }: PayloadAction<{ tokenSymbol: string; subAccountId: string; amount: string }>,
      ) {
        const { tokenSymbol, subAccountId, amount } = payload;
        const assetIndex = state.list.assets.findIndex((asset) => asset.tokenSymbol === tokenSymbol);

        const marketPrince =
          state.utilData.tokensMarket.find((tokenMarket) => tokenMarket.symbol === tokenSymbol)?.price || "0";
        const decimals = state.list.assets.find((asset) => asset.tokenSymbol === tokenSymbol)?.decimal;
        const USDAmount = marketPrince ? getUSDFromToken(amount, marketPrince, Number(decimals)) : "0";

        if (assetIndex !== -1 && state.list.assets[assetIndex]) {
          const newAssetSubAccounts = state.list.assets[assetIndex].subAccounts.map((subAccount) => {
            if (subAccount.sub_account_id === subAccountId) {
              return {
                ...subAccount,
                amount,
                currency_amount: USDAmount,
              };
            }
            return subAccount;
          });

          state.list.assets[assetIndex].subAccounts = newAssetSubAccounts;
        }
      },
      prepare(tokenSymbol: string, subAccountId: string, amount: string) {
        return { payload: { tokenSymbol, subAccountId, amount } };
      },
    },
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
    setSelectedAsset(state, action) {
      state.helper.selectedAsset = action.payload;
    },
    setSelectedAccount(state, action) {
      state.helper.selectedAccount = action.payload;
    },
    setAccordionAssetIdx(state, action: PayloadAction<string[]>) {
      state.helper.accordionIndex = action.payload;
    },
    clearDataAsset(state) {
      (state.helper.initLoad = true), (state.ICPSubaccounts = []);
      state.utilData.tokensMarket = [];
      state.accounts = [];
      state.list.assets = [];
      state.helper.selectedAccount = undefined;
      state.helper.selectedAsset = undefined;
      state.helper.accordionIndex = [];
      state.utilData.icr1SystemAssets = ICRC1systemAssets;
    },
  },
});

export const {
  addReduxAsset,
  updateReduxAsset,
  deleteReduxAsset,
  setInitLoad,
  clearDataAsset,
  setAssetMutationAction,
  setICRC1SystemAssets,
  setICPSubaccounts,
  setTokenMarket,
  setAssets,
  setAccounts,
  setSelectedAsset,
  setSelectedAccount,
  setAccordionAssetIdx,
  updateSubAccountBalance,
  setAssetMutation,
  setAssetMutationResult,
} = assetSlice.actions;

export default assetSlice.reducer;
