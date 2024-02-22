import { useAppSelector } from "@redux/Store";
import {
  setFullAllowanceErrorsAction,
  setIsCreateAllowanceAction,
  setIsUpdateAllowanceAction,
  setSelectedAllowanceAction,
} from "@redux/allowance/AllowanceActions";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";

interface UseAllowanceDrawer {
  isCreateAllowance: boolean;
  isUpdateAllowance: boolean;
  isLoading: boolean;
  onCloseCreateAllowanceDrawer: () => void;
  onOpenCreateAllowanceDrawer: () => void;
  onCloseUpdateAllowanceDrawer: () => void;
  onOpenUpdateAllowanceDrawer: () => void;
}

export default function useAllowanceDrawer(): UseAllowanceDrawer {
  const { isCreateAllowance, isUpdateAllowance, isLoading } = useAppSelector(({ allowance }) => allowance);
  function onCloseCreateAllowanceDrawer() {
    setIsCreateAllowanceAction(false);
    setFullAllowanceErrorsAction([]);
    setSelectedAllowanceAction(initialAllowanceState);
  }

  function onOpenCreateAllowanceDrawer() {
    setIsCreateAllowanceAction(true);
  }

  function onCloseUpdateAllowanceDrawer() {
    setIsUpdateAllowanceAction(false);
    setFullAllowanceErrorsAction([]);
    setSelectedAllowanceAction(initialAllowanceState);
  }

  function onOpenUpdateAllowanceDrawer() {
    setIsUpdateAllowanceAction(true);
  }

  return {
    isCreateAllowance,
    isUpdateAllowance,
    isLoading,
    onCloseCreateAllowanceDrawer,
    onOpenCreateAllowanceDrawer,
    onCloseUpdateAllowanceDrawer,
    onOpenUpdateAllowanceDrawer,
  };
}
