import { TAllowance } from "@/@types/allowance";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AllowanceState {
  isUpdateAllowance: boolean;
  isCreateAllowance: boolean;
  selectedAllowance?: TAllowance;
}

const reducerName = "allowance";

const initialState: AllowanceState = {
  isUpdateAllowance: false,
  isCreateAllowance: false,
  selectedAllowance: undefined,
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
  },
});

export const { setIsUpdateAllowance, setIsCreateAllowance, setSelectedAllowance } = allowanceSlice.actions;
export default allowanceSlice.reducer;
