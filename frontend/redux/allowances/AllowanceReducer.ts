import { createSlice } from "@reduxjs/toolkit";

interface AllowanceState {
  isCreateAllowance: boolean;
}

const initialState: AllowanceState = {
  isCreateAllowance: false,
};

const allowanceSlice = createSlice({
  name: "allowance",
  initialState,
  reducers: {
    setCreateAllowance(state, action) {
      state.isCreateAllowance = action.payload;
      return state;
    },
  },
});

export const { setCreateAllowance } = allowanceSlice.actions;
export default allowanceSlice.reducer;
