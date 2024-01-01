import { Allowance } from "@/@types/allowance";
import { createSlice } from "@reduxjs/toolkit";

interface AllowanceState {
  isCreateAllowance: boolean;
  isUpdateAllowance: boolean;
  selectedAllowance: Allowance;
}

const initialState: AllowanceState = {
  isCreateAllowance: false,
  isUpdateAllowance: false,
  selectedAllowance: {},
};

const allowanceSlice = createSlice({
  name: "allowance",
  initialState,
  reducers: {
    setCreateAllowance(state, action) {
      state.isCreateAllowance = action.payload;
      return state;
    },
    setUpdateAllowance(state, action) {
      state.isUpdateAllowance = action.payload;
      return state;
    },
    setSelectedAllowance(state, action) {
      const newSelectedAllowance = {
        ...state.selectedAllowance,
        ...action.payload,
      };
      state.selectedAllowance = newSelectedAllowance;
    },
  },
});

export const { setCreateAllowance, setUpdateAllowance, setSelectedAllowance } = allowanceSlice.actions;
export default allowanceSlice.reducer;
