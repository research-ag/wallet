import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TokenMarketInfo } from "@redux/models/TokenModels";
import { Asset, ICPSubAccount, SubAccount } from "@redux/models/AccountModels";
import { getUSDFromToken } from "@/utils";
import { ICRC1systemAssets } from "@/defaultTokens";

interface AssetStateHelper {
  initLoad: boolean;
  accordionIndex: string[];
  selectedAsset: Asset | undefined;
  selectedAccount: SubAccount | undefined;
}

interface AssetState {
  helper: AssetStateHelper;
  ICPSubaccounts: Array<ICPSubAccount>;
  accounts: Array<SubAccount>;
  icr1SystemAssets: Asset[];
  tokensMarket: TokenMarketInfo[];
  assets: Array<Asset>;
  mutation: { asset?: Asset };
}

const initialState: AssetState = {
  helper: {
    accordionIndex: [],
    selectedAsset: undefined,
    selectedAccount: undefined,
    initLoad: true,
  },
  mutation: {
    asset: undefined,
  },
  ICPSubaccounts: [],
  icr1SystemAssets: ICRC1systemAssets,
  tokensMarket: [],
  assets: [],
  accounts: [],
};

const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    // state helpers
    setInitLoad(state, action: PayloadAction<boolean>) {
      state.helper.initLoad = action.payload;
    },
    setAssetMutation(state, action: PayloadAction<Asset | undefined>) {
      state.mutation.asset = action.payload;
    },
    setICRC1SystemAssets(state, action: PayloadAction<Asset[]>) {
      state.icr1SystemAssets = [...ICRC1systemAssets, ...action.payload];
    },
    setICPSubaccounts(state, action: PayloadAction<ICPSubAccount[]>) {
      state.ICPSubaccounts = action.payload;
    },
    setTokenMarket(state, action: PayloadAction<TokenMarketInfo[]>) {
      state.tokensMarket = action.payload;
    },
    // asset reducers
    setAssets(state, action) {
      state.assets = action.payload.sort((a: Asset, b: Asset) => {
        return a.sortIndex - b.sortIndex;
      });
    },
    // sub accounts reducers
    updateSubAccountBalance: {
      reducer(
        state: AssetState,
        { payload }: PayloadAction<{ tokenSymbol: string; subAccountId: string; amount: string }>,
      ) {
        const { tokenSymbol, subAccountId, amount } = payload;
        const assetIndex = state.assets.findIndex((asset) => asset.tokenSymbol === tokenSymbol);

        const marketPrince = state.tokensMarket.find((tokenMarket) => tokenMarket.symbol === tokenSymbol)?.price || "0";
        const decimals = state.assets.find((asset) => asset.tokenSymbol === tokenSymbol)?.decimal;
        const USDAmount = marketPrince ? getUSDFromToken(amount, marketPrince, Number(decimals)) : "0";

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
      state.tokensMarket = [];
      state.accounts = [];
      state.assets = [];
      state.helper.selectedAccount = undefined;
      state.helper.selectedAsset = undefined;
      state.helper.accordionIndex = [];
      state.icr1SystemAssets = ICRC1systemAssets;
    },
  },
});

export const {
  setInitLoad,
  clearDataAsset,
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
} = assetSlice.actions;

export default assetSlice.reducer;
