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

  useEffect(() => {
    const allowInitializeAsset =
      selectedAsset && selectedAsset?.tokenName !== sender?.asset?.tokenName && !sender?.asset?.tokenName;

    if (allowInitializeAsset) {
      setSenderAssetAction(selectedAsset);
    }
  }, [selectedAsset]);

  useEffect(() => {
    const allowInitializeSubAccount =
      !isObjectValid(sender.newAllowanceContact) &&
      !isObjectValid(sender.allowanceContactSubAccount) &&
      !sender?.subAccount;

    if (selectedAccount) {
      if (allowInitializeSubAccount) {
        setSenderSubAccountAction(selectedAccount);
      }
    }
  }, [selectedAccount]);

  return children;
}
