import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import { setIsInspectDetailAction } from "@redux/transaction/TransactionActions";
import { Button } from "@components/button";
import useSend from "@pages/home/hooks/useSend";

export default function SendForm() {
  const { isSender, isReceiver } = useSend();

  return (
    <div className="w-full">
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
  );

  function onNext() {
    if (isReceiver && isSender) {
      setIsInspectDetailAction(true);
    }
  }
  function onCancel() {
    // TODO: initialize state and close drawer
    // console.log("cancel");
  }
}
