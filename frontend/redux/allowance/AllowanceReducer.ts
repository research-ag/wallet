import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AllowanceState {
  isUpdateAllowance: boolean;
  isCreateAllowance: boolean;
}

const reducerName = "allowance";

const initialState: AllowanceState = {
  isUpdateAllowance: false,
  isCreateAllowance: false,
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
  },
});

export const { setIsUpdateAllowance, setIsCreateAllowance } = allowanceSlice.actions;
export default allowanceSlice.reducer;
