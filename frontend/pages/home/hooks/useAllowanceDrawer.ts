import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setIsCreateAllowance, setIsUpdateAllowance } from "@redux/allowance/AllowanceReducer";

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
  }

  function onOpenCreateAllowanceDrawer() {
    dispatch(setIsCreateAllowance(true));
  }

  function onCloseUpdateAllowanceDrawer() {
    dispatch(setIsUpdateAllowance(false));
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
