import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface CommonState {
  isAppDataFreshing: boolean;
  lastDataRefresh: string;
  watchOnlyHistory: WatchOnlyItem[];
}

const initialState: CommonState = {
  isAppDataFreshing: false,
  lastDataRefresh: dayjs().toISOString(),
  watchOnlyHistory: [],
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
    setWatchOnlyHistory(state, action: PayloadAction<WatchOnlyItem[]>) {
      state.watchOnlyHistory = action.payload;
    },
  },
});

export const {
  setAppDataRefreshing,
  setLastDataRefresh,
  setWatchOnlyHistory
} = commonSlice.actions;

export default commonSlice.reducer;
