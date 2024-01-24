import { Button } from "@components/button";
import SenderDetail from "./SenderDetail";
import ReceiverDetail from "./ReceiverDetail";
import TransactionAmount from "./TransactionAmount";
import store, { useAppSelector } from "@redux/Store";
import { transferAmount } from "@pages/home/helpers/icrc";
import { Dispatch, SetStateAction } from "react";
import useSend from "@pages/home/hooks/useSend";
import { setIsInspectDetailAction } from "@redux/transaction/TransactionActions";

interface ConfirmDetailProps {
  showConfirmationModal: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmDetail({ showConfirmationModal }: ConfirmDetailProps) {
  const { sender } = useAppSelector((state) => state.transaction);
  const { receiverPrincipal, receiverSubAccount, senderSubAccount, amount, enableSend } = useSend();

  return (
    <div className="w-full px-[2rem] grid grid-cols-1 gap-y-2">
      <SenderDetail />
      <ReceiverDetail />
      <TransactionAmount />
      <div className="flex justify-end mt-6">
        <Button className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={OnBack}>
          Back
        </Button>
        <Button className="w-1/6 font-bold bg-primary-color" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );

  async function onDone() {
    // TODO: execute transaction and validate information
    const assetAddress = sender.asset.address;
    const decimal = sender.asset.decimal;

    if (enableSend) {
      console.log({
        assetAddress,
        decimal,
        senderSubAccount,
        receiverPrincipal,
        receiverSubAccount,
        amount,
      });
      // await transferAmount(receiverPrincipal, assetAddress, amount, decimal, fromSubAccount, toSubAccount);
      // TODO: once the transaction is completed show update modal info
      // showConfirmationModal(true);
    }
  }

  function OnBack() {
    setIsInspectDetailAction(false);
  }
}
