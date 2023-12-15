import { Principal } from "@dfinity/principal";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import {
  setFullAllowanceErrorsAction,
  setIsCreateAllowanceAction,
  setIsFromServicesAction,
  setIsUpdateAllowanceAction,
  setSelectedAllowanceAction,
} from "@redux/allowance/AllowanceActions";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { setSelectedAsset } from "@redux/assets/AssetReducer";
import { Asset } from "@redux/models/AccountModels";
import { Buffer } from "buffer";

interface UseAllowanceDrawer {
  isCreateAllowance: boolean;
  isUpdateAllowance: boolean;
  isLoading: boolean;
  onCloseCreateAllowanceDrawer: () => void;
  onOpenCreateAllowanceDrawer: () => void;
  onOpenCreateAllowanceDrawerFromService: (asset: Asset, spender: string) => void;
  onCloseUpdateAllowanceDrawer: () => void;
  onOpenUpdateAllowanceDrawer: () => void;
}

export default function useAllowanceDrawer(): UseAllowanceDrawer {
  const { isCreateAllowance, isUpdateAllowance, isLoading, selectedAllowance } = useAppSelector(
    ({ allowance }) => allowance,
  );
  const { authClient } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  function onCloseCreateAllowanceDrawer() {
    setIsFromServicesAction(false);
    setIsCreateAllowanceAction(false);
    setFullAllowanceErrorsAction([]);
    setSelectedAllowanceAction(initialAllowanceState);
  }

  function onOpenCreateAllowanceDrawer() {
    setIsCreateAllowanceAction(true);
  }
  function onOpenCreateAllowanceDrawerFromService(asset: Asset, spender: string) {
    const princBytes = Principal.fromText(authClient).toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    setSelectedAllowanceAction({ ...selectedAllowance, spender: spender, spenderSubaccount: princSubId });
    setIsFromServicesAction(true);
    dispatch(setSelectedAsset(asset));
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
    onOpenCreateAllowanceDrawerFromService,
    onCloseUpdateAllowanceDrawer,
    onOpenUpdateAllowanceDrawer,
  };
}
