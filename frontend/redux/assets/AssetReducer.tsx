import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TokenMarketInfo } from "@redux/models/TokenModels";
import { Asset, ICPSubAccount, SubAccount, Transaction, TransactionList } from "@redux/models/AccountModels";
import { getUSDfromToken } from "@/utils";
import { ICRC1systemAssets } from "@/defaultTokens";

interface AssetState {
  initLoad: boolean;
  ICPSubaccounts: Array<ICPSubAccount>;
  assetLoading: boolean;
  // REMOVE: tokens: Token[];
  icr1SystemAssets: Asset[];
  tokensMarket: TokenMarketInfo[];
  assets: Array<Asset>;
  accounts: Array<SubAccount>;
  acordeonIdx: string[];
  transactions: Array<Transaction>;
  selectedAsset: Asset | undefined;
  selectedAccount: SubAccount | undefined;
  selectedTransaction: Transaction | undefined;
  txWorker: Array<TransactionList>;
  txLoad: boolean;
}

const initialState: AssetState = {
  initLoad: true,
  ICPSubaccounts: [],
  assetLoading: false,
  // REMOVE: tokens: [],
  icr1SystemAssets: ICRC1systemAssets,
  tokensMarket: [],
  assets: [],
  accounts: [],
  acordeonIdx: [],
  transactions: [],
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
    setReduxTokens() {
      // REMOVE: state.tokens = action.payload;
    },
    setICRC1SystemAssets(state, action: PayloadAction<Asset[]>) {
      state.icr1SystemAssets = [...ICRC1systemAssets, ...action.payload];
    },
    setICPSubaccounts(state, action: PayloadAction<ICPSubAccount[]>) {
      state.ICPSubaccounts = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.assetLoading = action.payload;
    },
    // TODO: Revisit this code to see if we can use filter()
    removeToken(state, action: PayloadAction<string>) {
      const { payload: symbolToRemove } = action;
      let count = 0;

      // Iterate all Tokens and ignore the one that has
      // the symbol marked to be removed
      // REMOVE:
      // const auxTkns: Asset[] = [];
      // state.tokens.map((tkn) => {
      //   count++;
      //   if (tkn.symbol !== symbolToRemove) {
      //     auxTkns.push({ ...tkn, id_number: count - 1 });
      //   }
      // });
      // state.tokens = auxTkns;

      // count = 0;

      // Iterate all Assets and ignore the one that has
      // the symbol marked to be removed
      const auxAssets: Asset[] = [];
      state.assets.map((asst) => {
        count++;
        if (asst.tokenSymbol !== symbolToRemove) {
          auxAssets.push({ ...asst, sortIndex: count - 1 });
        }
      });
      state.assets = auxAssets;
    },
    editToken: {
      reducer(
        state,
        action: PayloadAction<{
          token: Asset;
          tokenSymbol: string;
        }>,
      ) {
        const { token, tokenSymbol } = action.payload;
        // REMOVE:
        // const auxTokens = state.tokens.map((tkn) => {
        //   if (tkn.id_number === token.id_number) {
        //     return token;
        //   } else
        //     return {
        //       ...tkn,
        //       shortDecimal:
        //         tkn.shortDecimal === "" ? Number(tkn.decimal).toFixed() : Number(tkn.shortDecimal).toFixed(),
        //     };
        // });
        const auxAssets = state.assets.map((asst) => {
          if (asst.tokenSymbol === tokenSymbol) {
            return {
              ...asst,
              symbol: token.symbol,
              name: token.name,
              index: token.index,
              shortDecimal:
                token.shortDecimal === "" ? Number(token.decimal).toFixed() : Number(token.shortDecimal).toFixed(),
            };
          } else return asst;
        });
        // REMOVE:
        // state.tokens = auxTokens;
        state.assets = auxAssets;
      },
      prepare(token: Asset, tokenSymbol: string) {
        return {
          payload: { token, tokenSymbol },
        };
      },
    },
    updateSubAccountBalance: {
      reducer(
        state: AssetState,
        { payload }: PayloadAction<{ tokenSymbol: string; subAccountId: string; amount: string }>,
      ) {
        const { tokenSymbol, subAccountId, amount } = payload;
        // REMOVE:
        // const tokenIndex = state.tokens.findIndex((token) => token.tokenSymbol === tokenSymbol);
        const assetIndex = state.assets.findIndex((asset) => asset.tokenSymbol === tokenSymbol);

        const marketPrince = state.tokensMarket.find((tokenMarket) => tokenMarket.symbol === tokenSymbol)?.price || "0";
        const decimals = state.assets.find((asset) => asset.tokenSymbol === tokenSymbol)?.decimal;
        const USDAmount = marketPrince ? getUSDfromToken(amount, marketPrince, Number(decimals)) : "0";

        // REMOVE:
        // if (tokenIndex !== -1 && state.tokens[tokenIndex]) {
        //   const newTokenSubAccounts = state.tokens[tokenIndex].subAccounts.map((subAccount) => {
        //     if (subAccount.numb === subAccountId) {
        //       return {
        //         ...subAccount,
        //         amount,
        //         currency_amount: USDAmount,
        //       };
        //     }
        //     return subAccount;
        //   });

        //   state.tokens[tokenIndex].subAccounts = newTokenSubAccounts;
        // }

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
          tokenIndex: number | string;
          subaccountId: number | string;
          name: string;
        }>,
      ) {
        const { tokenIndex, subaccountId, name } = action.payload;

        if (state.assets[Number(tokenIndex)] && state.assets[Number(tokenIndex)].subAccounts[Number(subaccountId)])
          state.assets[Number(tokenIndex)].subAccounts[Number(subaccountId)].name = name;
        // REMOVE:
        // if (state.tokens[Number(tokenIndex)] && state.tokens[Number(tokenIndex)].subAccounts[Number(subaccountId)])
        //   state.tokens[Number(tokenIndex)].subAccounts[Number(subaccountId)].name = name;
      },
      prepare(tokenIndex: string | number, subaccountId: string | number, name: string) {
        return {
          payload: { tokenIndex, subaccountId, name },
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
          tokenIndex: number | string;
          subaccount: SubAccount;
        }>,
      ) {
        const { tokenIndex, subaccount } = action.payload;
        if (state.assets[Number(tokenIndex)]) {
          state.assets[Number(tokenIndex)].subAccounts.push(subaccount);
          state.assets[Number(tokenIndex)].subAccounts.sort((a, b) => {
            return Number(a.sub_account_id) - Number(b.sub_account_id);
          });
        }
        // REMOVE:
        // if (state.tokens[Number(tokenIndex)]) {
        //   state.tokens[Number(tokenIndex)].subAccounts.push({
        //     name: subaccount.name,
        //     numb: subaccount.sub_account_id,
        //     amount: subaccount.amount,
        //     currency_amount: subaccount.currency_amount,
        //   });
        //   state.tokens[Number(tokenIndex)].subAccounts.sort((a, b) => {
        //     return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt(0)) || 0;
        //   });
        // }
      },
      prepare(tokenIndex: string | number, subaccount: SubAccount) {
        return {
          payload: { tokenIndex, subaccount },
        };
      },
    },
    removeSubAcc: {
      reducer(
        state,
        action: PayloadAction<{
          tokenIndex: number | string;
          subIndex: number | string;
        }>,
      ) {
        const { tokenIndex, subIndex } = action.payload;
        if (state.assets[Number(tokenIndex)]) {
          state.assets[Number(tokenIndex)].subAccounts.splice(Number(subIndex), 1);
        }
        // REMOVE:
        // if (state.tokens[Number(tokenIndex)]) {
        //   state.tokens[Number(tokenIndex)].subAccounts.splice(Number(subIndex), 1);
        // }
      },
      prepare(tokenIndex: string | number, subIndex: string | number) {
        return {
          payload: { tokenIndex, subIndex },
        };
      },
    },
    setAssets(state, action) {
      state.assets = action.payload.sort((a: any, b: any) => {
        return a.sort_index - b.sort_index;
      });
    },
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
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
    setTxLoad(state, action) {
      state.txLoad = action.payload;
    },
    setAcordeonAssetIdx(state, action: PayloadAction<string[]>) {
      state.acordeonIdx = action.payload;
    },
    clearDataAsset(state) {
      (state.initLoad = true), (state.ICPSubaccounts = []);
      // REMOVE:
      // state.tokens = [];
      state.tokensMarket = [];
      state.accounts = [];
      state.assets = [];
      state.transactions = [];
      state.txWorker = [];
      state.selectedAccount = undefined;
      state.selectedAsset = undefined;
      state.selectedTransaction = undefined;
      state.acordeonIdx = [];
      state.icr1SystemAssets = ICRC1systemAssets;
    },
  },
});

export const {
  setInitLoad,
  setReduxTokens,
  clearDataAsset,
  setICRC1SystemAssets,
  setICPSubaccounts,
  setLoading,
  removeToken,
  editToken,
  setTokenMarket,
  setSubAccountName,
  addSubAccount,
  removeSubAcc,
  setAssets,
  setAccounts,
  setTransactions,
  setSelectedAsset,
  setSelectedAccount,
  setSelectedTransaction,
  setTxWorker,
  addTxWorker,
  setTxLoad,
  setAcordeonAssetIdx,
  updateSubAccountBalance,
} = assetSlice.actions;

export default assetSlice.reducer;
