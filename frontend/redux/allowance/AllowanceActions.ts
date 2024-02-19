import store from "@redux/Store";
import { TAllowance } from "@/@types/allowance";
import {
  setIsUpdateAllowance,
  setIsCreateAllowance,
  setSelectedAllowance,
  setAllowances,
  setAllowanceError,
  removeAllowanceError,
  setFullAllowanceErrors,
  setIsDeleteAllowance,
} from "@/redux/allowance/AllowanceReducer";

export const setIsUpdateAllowanceAction = (isUpdate: boolean) => {
  store.dispatch(setIsUpdateAllowance(isUpdate));
};
export const setIsCreateAllowanceAction = (isCreate: boolean) => {
  store.dispatch(setIsCreateAllowance(isCreate));
};
export const setIsDeleteAllowanceAction = (isDelete: boolean) => {
  store.dispatch(setIsDeleteAllowance(isDelete));
};
export const setSelectedAllowanceAction = (allowance: TAllowance) => {
  store.dispatch(setSelectedAllowance(allowance));
};
export const setAllowancesAction = (allowances: TAllowance[]) => {
  store.dispatch(setAllowances(allowances));
};
export const setAllowanceErrorAction = (error: string) => {
  store.dispatch(setAllowanceError(error));
};
export const removeAllowanceErrorAction = (error: string) => {
  store.dispatch(removeAllowanceError(error));
};
export const setFullAllowanceErrorsAction = (errors: string[]) => {
  store.dispatch(setFullAllowanceErrors(errors));
};
