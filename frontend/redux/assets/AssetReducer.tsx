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
  subAccountMutation: SubAccount | undefined;
  extraData: any;
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
    subAccountMutation: undefined,
    extraData: undefined,
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
    setSubAccountMutation(state, action: PayloadAction<SubAccount | undefined>) {
      state.mutation.subAccountMutation = action.payload;
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
    setExtraDataMuatation(state, action: PayloadAction<any>) {
      state.mutation.extraData = action.payload;
    },
    setICRC1SystemAssets(state, action: PayloadAction<Asset[]>) {
      state.utilData.icr1SystemAssets = [...ICRC1systemAssets, ...action.payload];
    },
    setICPSubaccounts(state, action: PayloadAction<ICPSubAccount[]>) {
      state.ICPSubaccounts = action.payload;
    },
<<<<<<< HEAD
=======
    setLoading(state, action: PayloadAction<boolean>) {
      state.assetLoading = action.payload;
    },
    setTokens(state, action: PayloadAction<Token[]>) {
      state.tokens = action.payload;
    },
    addToken(state, action: PayloadAction<Token>) {
      state.tokens.push(action.payload);
    },
    removeToken(state, action: PayloadAction<string>) {
      let count = 0;
      const auxTkns: Token[] = [];
      state.tokens.map((tkn) => {
        count++;
        if (tkn.symbol !== action.payload) {
          auxTkns.push({ ...tkn, id_number: count - 1 });
        }
      });
      state.tokens = auxTkns;
      count = 0;
      const auxAssets: Asset[] = [];
      state.assets.map((asst) => {
        count++;
        if (asst.tokenSymbol !== action.payload) {
          auxAssets.push({ ...asst, sort_index: count - 1 });
        }
      });
      state.assets = auxAssets;
    },
    editToken: {
      reducer(
        state,
        action: PayloadAction<{
          token: Token;
          tokenSymbol: string;
        }>,
      ) {
        const { token, tokenSymbol } = action.payload;
        const auxTokens = state.tokens.map((tkn) => {
          if (tkn.id_number === token.id_number) {
            return token;
          } else return tkn;
        });
        const auxAssets = state.assets.map((asst) => {
          if (asst.tokenSymbol === tokenSymbol) {
            return { ...asst, symbol: token.symbol, name: token.name, index: token.index };
          } else return asst;
        });
        state.tokens = auxTokens;
        state.assets = auxAssets;
      },
      prepare(token: Token, tokenSymbol: string) {
        return {
          payload: { token, tokenSymbol },
        };
      },
    },
    setSubAccountName: {
      reducer(
        state,
        action: PayloadAction<{
          tokenIndex: number | string;
          subaccountId: number | string;
          name: string;
        }>,
      ) {
        const { tokenIndex, subaccountId, name } = action.payload;

        if (state.assets[Number(tokenIndex)] && state.assets[Number(tokenIndex)].subAccounts[Number(subaccountId)])
          state.assets[Number(tokenIndex)].subAccounts[Number(subaccountId)].name = name;
        if (state.tokens[Number(tokenIndex)] && state.tokens[Number(tokenIndex)].subAccounts[Number(subaccountId)])
          state.tokens[Number(tokenIndex)].subAccounts[Number(subaccountId)].name = name;
      },
      prepare(tokenIndex: string | number, subaccountId: string | number, name: string) {
        return {
          payload: { tokenIndex, subaccountId, name },
        };
      },
    },
>>>>>>> df1b1296 (delete assets with 0 balance)
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
  setSubAccountMutation,
  updateReduxAsset,
  deleteReduxAsset,
  setInitLoad,
  clearDataAsset,
  setAssetMutationAction,
  setICRC1SystemAssets,
  setICPSubaccounts,
<<<<<<< HEAD
=======
  setLoading,
  setTokens,
  addToken,
  removeToken,
  editToken,
>>>>>>> df1b1296 (delete assets with 0 balance)
  setTokenMarket,
  setAssets,
  setAccounts,
  setSelectedAsset,
  setSelectedAccount,
  setAccordionAssetIdx,
  updateSubAccountBalance,
  setAssetMutation,
  setAssetMutationResult,
  setExtraDataMuatation,
} = assetSlice.actions;

export default assetSlice.reducer;
