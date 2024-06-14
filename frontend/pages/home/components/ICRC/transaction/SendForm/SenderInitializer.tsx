import { RoutingPathEnum } from "@common/const";
import { isObjectValid } from "@pages/home/helpers/checkers";
import { useAppSelector } from "@redux/Store";
import { setSenderAssetAction, setSenderSubAccountAction } from "@redux/transaction/TransactionActions";
import { useEffect } from "react";

interface SenderInitializerProps {
  children: JSX.Element;
}

export default function SenderInitializer(props: SenderInitializerProps) {
  const { children } = props;
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const { sender } = useAppSelector((state) => state.transaction);
  const { route } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (route !== RoutingPathEnum.Enum.SERVICES) {
      const allowInitializeAsset =
        selectedAsset && selectedAsset?.tokenName !== sender?.asset?.tokenName && !sender?.asset?.tokenName;

      if (allowInitializeAsset) {
        setSenderAssetAction(selectedAsset);
      }
    }
  }, [selectedAsset]);

  useEffect(() => {
    if (route !== RoutingPathEnum.Enum.SERVICES) {
      const allowInitializeSubAccount =
        !isObjectValid(sender.newAllowanceContact) && !isObjectValid(sender.allowanceContactSubAccount);

      if (selectedAccount) {
        if (allowInitializeSubAccount) {
          setSenderSubAccountAction(selectedAccount);
        }
      }
    }
  }, [selectedAccount]);

  return children;
}
