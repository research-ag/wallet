// svg
//
import { useAppSelector } from "@redux/Store";

export const GeneralHook = () => {
  const { assets } = useAppSelector((state) => state.asset.list);
  const { ICPSubaccounts, accounts } = useAppSelector((state) => state.asset);
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);

  return {
    userAgent,
    userPrincipal,
    ICPSubaccounts,
    assets,
    accounts,
    selectedAsset,
    selectedAccount,
  };
};
