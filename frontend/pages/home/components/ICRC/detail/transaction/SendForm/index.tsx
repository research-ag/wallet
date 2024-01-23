import SenderAsset from "./SenderAsset";
import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import { useAppSelector } from "@redux/Store";
import SenderQRScanner from "./SenderQRScanner";
import ReceiverQRScanner from "./ReceiverQRScanner";
import { useEffect, useMemo } from "react";
import {
  setIsInspectDetailAction,
  setSenderAssetAction,
  setSenderSubAccountAction,
} from "@redux/transaction/TransactionActions";
import { isObjectValid } from "@/utils/checkers";
import ConfirmDetail from "./ConfirmDetail";
import { Button } from "@components/button";
import { TransactionScannerOptionEnum } from "@/@types/transactions";

export default function SendForm() {
  const { sender, receiver, scannerActiveOption, isInspectTransference } = useAppSelector((state) => state.transaction);

  const isSender = useMemo(() => {
    return Boolean(
      sender?.allowanceContactSubAccount?.assetTokenSymbol ||
        sender?.newAllowanceContact?.principal ||
        sender?.subAccount?.sub_account_id,
    );
  }, [sender]);

  const isReceiver = useMemo(() => {
    return Boolean(
      receiver?.ownSubAccount?.sub_account_id ||
        receiver?.thirdNewContact?.principal ||
        receiver?.thirdContactSubAccount?.assetTokenSymbol,
    );
  }, [receiver]);

  const showInspectDetail = useMemo(() => {
    if (!isInspectTransference) return false;
    return isSender && isReceiver;
  }, [sender, receiver, isInspectTransference]);

  if (showInspectDetail) return <ConfirmDetail />;
  if (scannerActiveOption === TransactionScannerOptionEnum.Values.sender) return <SenderQRScanner />;
  if (scannerActiveOption === TransactionScannerOptionEnum.Values.receiver) return <ReceiverQRScanner />;

  console.log({ sender, receiver });

  return (
    <SenderInitializer>
      <div className="w-full">
        <SenderAsset />
        <SenderItem />
        <DownAmountIcon className="w-full mt-4" />
        <ReceiverItem />
        <div className="flex justify-end mt-6">
          <Button className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="w-1/6 font-bold bg-primary-color" disabled={!(isReceiver && isSender)} onClick={onNext}>
            Next
          </Button>
        </div>
      </div>
    </SenderInitializer>
  );

  function onNext() {
    if (isReceiver && isSender) {
      setIsInspectDetailAction(true);
    }
  }
  function onCancel() {
    // TODO: initialize state and close drawer
  }
}

function SenderInitializer({ children }: { children: JSX.Element }) {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
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
