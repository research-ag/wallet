import { setCreateAllowance } from "./AllowanceReducer";
import store from "@redux/Store";

export const setIsCreateAllowance = (isOpen: boolean) => {
  const { dispatch } = store;
  dispatch(setCreateAllowance(isOpen));
};
