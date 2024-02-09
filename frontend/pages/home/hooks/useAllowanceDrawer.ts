import { useAppDispatch, useAppSelector } from "@redux/Store";
import {
  initialAllowanceState,
  setFullAllowanceErrors,
  setIsCreateAllowance,
  setIsUpdateAllowance,
  setSelectedAllowance,
} from "@redux/allowance/AllowanceReducer";

interface UseAllowanceDrawer {
  isCreateAllowance: boolean;
  isUpdateAllowance: boolean;
  onCloseCreateAllowanceDrawer: () => void;
  onOpenCreateAllowanceDrawer: () => void;
  onCloseUpdateAllowanceDrawer: () => void;
  onOpenUpdateAllowanceDrawer: () => void;
}

export default function useAllowanceDrawer(): UseAllowanceDrawer {
  const { isCreateAllowance, isUpdateAllowance } = useAppSelector(({ allowance }) => allowance);
  const dispatch = useAppDispatch();

  function onCloseCreateAllowanceDrawer() {
    dispatch(setIsCreateAllowance(false));
    dispatch(setFullAllowanceErrors([]));
    dispatch(setSelectedAllowance(initialAllowanceState));
  }

  function onOpenCreateAllowanceDrawer() {
    dispatch(setIsCreateAllowance(true));
  }

  function onCloseUpdateAllowanceDrawer() {
    dispatch(setIsUpdateAllowance(false));
    dispatch(setFullAllowanceErrors([]));
    dispatch(setSelectedAllowance(initialAllowanceState));
  }

  function onOpenUpdateAllowanceDrawer() {
    dispatch(setIsUpdateAllowance(true));
  }

  return {
    isCreateAllowance,
    isUpdateAllowance,
    onCloseCreateAllowanceDrawer,
    onOpenCreateAllowanceDrawer,
    onCloseUpdateAllowanceDrawer,
    onOpenUpdateAllowanceDrawer,
  };
}
