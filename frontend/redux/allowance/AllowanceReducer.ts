import { TAllowance } from "@/@types/allowance";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const initialAllowanceState: TAllowance = {
  asset: {
    logo: "",
    name: "",
    symbol: "",
    address: "",
    decimal: "",
    tokenName: "",
    tokenSymbol: "",
    supportedStandards: [],
  },
  id: "",
  subAccountId: "",
  spender: "",
  amount: "",
  expiration: "",
};

interface AllowanceState {
  isUpdateAllowance: boolean;
  isCreateAllowance: boolean;
  isDeleteAllowance: boolean;
  isLoading: boolean;
  selectedAllowance: TAllowance;
  allowances: TAllowance[];
  errors: string[];
}

const reducerName = "allowance";

const initialState: AllowanceState = {
  isUpdateAllowance: false,
  isCreateAllowance: false,
  isDeleteAllowance: false,
  isLoading: false,
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
    setIsDeleteAllowance(state: AllowanceState, action: PayloadAction<boolean>) {
      state.isDeleteAllowance = action.payload;
    },
    setSelectedAllowance(state: AllowanceState, action: PayloadAction<TAllowance>) {
      state.selectedAllowance = action.payload;
    },
    setReduxAllowances(state: AllowanceState, action: PayloadAction<TAllowance[]>) {
      state.allowances = action.payload;
    },
    addReduxAllowance(state: AllowanceState, action: PayloadAction<TAllowance>) {
      state.allowances = [...state.allowances, action.payload];
    },
    updateReduxAllowance(state: AllowanceState, action: PayloadAction<TAllowance>) {
      state.allowances = state.allowances.map((allowance) =>
        allowance.id === action.payload.id ? action.payload : allowance
      );
    },
    deleteReduxAllowance(state: AllowanceState, action: PayloadAction<string>) {
      state.allowances = state.allowances.filter((allowance) => allowance.id !== action.payload);
    },
    setAllowanceError(state: AllowanceState, action: PayloadAction<string>) {
      const currentErrors = [...(state.errors ?? [])];
      state.errors = currentErrors.includes(action.payload) ? currentErrors : [...currentErrors, action.payload];
    },
    setIsLoading(state: AllowanceState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
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
  setIsDeleteAllowance,
  setSelectedAllowance,
  setReduxAllowances,
  updateReduxAllowance,
  deleteReduxAllowance,
  addReduxAllowance,
  setIsLoading,
  setAllowanceError,
  removeAllowanceError,
  setFullAllowanceErrors,
} = allowanceSlice.actions;
export default allowanceSlice.reducer;
