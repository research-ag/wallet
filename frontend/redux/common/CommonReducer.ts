import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface CommonState {
  isAppDataFreshing: boolean;
  lastDataRefresh: string;
}

const initialState: CommonState = {
  isAppDataFreshing: false,
  lastDataRefresh: dayjs().toISOString(),
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setAppDataRefreshing(state, action: PayloadAction<boolean>) {
      state.isAppDataFreshing = action.payload;
    },
    setLastDataRefresh(state, action: PayloadAction<string>) {
      state.lastDataRefresh = action.payload;
    },
  },
});

export const { setAppDataRefreshing, setLastDataRefresh } = commonSlice.actions;
export default commonSlice.reducer;
