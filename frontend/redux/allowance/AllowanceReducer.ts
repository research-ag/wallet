import { TAllowance } from "@/@types/allowance";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const initialAllowanceState: TAllowance = {
  asset: {
    logo: "",
    name: "",
    symbol: "",
    subAccounts: [],
    address: "",
    decimal: "",
    sort_index: 0,
    index: "",
    tokenName: "",
    tokenSymbol: "",
    shortDecimal: "",
    supportedStandards: [],
  },
  subAccount: {
    name: "",
    sub_account_id: "",
    address: "",
    amount: "",
    currency_amount: "",
    transaction_fee: "",
    decimal: 0,
    symbol: "",
  },
  spender: {
    name: "",
    accountIdentifier: "",
    principal: "",
  },
  amount: "",
  expiration: "",
  noExpire: true,
};

interface AllowanceState {
  isUpdateAllowance: boolean;
  isCreateAllowance: boolean;
  selectedAllowance: TAllowance;
  allowances: TAllowance[];
  errors: string[];
}

const reducerName = "allowance";

const initialState: AllowanceState = {
  isUpdateAllowance: false,
  isCreateAllowance: false,
  selectedAllowance: initialAllowanceState,
  allowances: [],
  errors: [],
};

const allowanceSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setIsUpdateAllowance(state: AllowanceState, action: PayloadAction<boolean>) {
      state.isUpdateAllowance = action.payload;
    },
    setIsCreateAllowance(state: AllowanceState, action: PayloadAction<boolean>) {
      state.isCreateAllowance = action.payload;
    },
    setSelectedAllowance(state: AllowanceState, action: PayloadAction<TAllowance>) {
      state.selectedAllowance = action.payload;
    },
    setAllowances(state: AllowanceState, action: PayloadAction<TAllowance[]>) {
      state.allowances = action.payload;
    },
    setAllowanceError(state: AllowanceState, action: PayloadAction<string>) {
      const currentErrors = [...(state.errors ?? [])];
      state.errors = currentErrors.includes(action.payload) ? currentErrors : [...currentErrors, action.payload];
    },
    removeAllowanceError(state: AllowanceState, action: PayloadAction<string>) {
      state.errors = state.errors?.filter((error) => error !== action.payload);
    },
    setFullAllowanceErrors(state: AllowanceState, action: PayloadAction<string[]>) {
      state.errors = action.payload;
    },
  },
});

export const {
  setIsUpdateAllowance,
  setIsCreateAllowance,
  setSelectedAllowance,
  setAllowances,
  setAllowanceError,
  removeAllowanceError,
  setFullAllowanceErrors,
} = allowanceSlice.actions;
export default allowanceSlice.reducer;
