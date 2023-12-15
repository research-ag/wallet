import store from "@redux/Store";
import { TAllowance } from "@/@types/allowance";
import {
  setIsUpdateAllowance,
  setIsCreateAllowance,
  setSelectedAllowance,
  setAllowanceError,
  removeAllowanceError,
  setFullAllowanceErrors,
  setIsDeleteAllowance,
  setIsLoading,
  setIsFromService,
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

export const setAllowanceErrorAction = (error: string) => {
  store.dispatch(setAllowanceError(error));
};

export const removeAllowanceErrorAction = (error: string) => {
  store.dispatch(removeAllowanceError(error));
};

export const setFullAllowanceErrorsAction = (errors: string[]) => {
  store.dispatch(setFullAllowanceErrors(errors));
};

export const setIsLoadingAllowanceAction = (isLoading: boolean) => {
  store.dispatch(setIsLoading(isLoading));
};

export const setIsFromServicesAction = (fromServices: boolean) => {
  store.dispatch(setIsFromService(fromServices));
};
