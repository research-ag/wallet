import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  isAppDataFreshing: boolean;
}

const initialState: CommonState = {
  isAppDataFreshing: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setAppDataRefreshing(state, action: PayloadAction<boolean>) {
      state.isAppDataFreshing = action.payload;
    },
  },
});

export const { setAppDataRefreshing } = commonSlice.actions;

export default commonSlice.reducer;
