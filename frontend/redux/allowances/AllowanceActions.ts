import { TAllowance } from "@/@types/allowance";
import { setCreateAllowance, setSelectedAllowance, setUpdateAllowance } from "./AllowanceReducer";
import store from "@redux/Store";

export enum CreateActionType {
  openDrawer = "SET_IS_OPEN_CREATE_ALLOWANCE",
  closeDrawer = "SET_IS_CLOSE_CREATE_ALLOWANCE",
}

export enum EditActionType {
  openDrawer = "SET_IS_OPEN_EDIT_ALLOWANCE",
  closeDrawer = "SET_IS_CLOSE_EDIT_ALLOWANCE",
}

export const setCreateAllowanceDrawerState = (drawerState: CreateActionType) => {
  const { dispatch } = store;

  switch (drawerState) {
    case CreateActionType.closeDrawer:
      dispatch(setCreateAllowance(false));
      break;

    case CreateActionType.openDrawer:
      dispatch(setCreateAllowance(true));
      break;
    default:
      throw new Error("Drawer state not allowed.");
  }
};

export const setEditAllowanceDrawerState = (drawerState: EditActionType) => {
  const { dispatch } = store;

  switch (drawerState) {
    case EditActionType.closeDrawer:
      dispatch(setUpdateAllowance(false));
      break;

    case EditActionType.openDrawer:
      dispatch(setUpdateAllowance(true));
      break;
    default:
      throw new Error("Drawer state not allowed.");
  }
};

export const setSelectedAllowanceAction = (allowance: TAllowance) => {
  const { dispatch } = store;
  dispatch(setSelectedAllowance(allowance));
};
