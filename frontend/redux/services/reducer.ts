import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
});

export const actions = servicesSlice.actions;
export default servicesSlice.reducer;
