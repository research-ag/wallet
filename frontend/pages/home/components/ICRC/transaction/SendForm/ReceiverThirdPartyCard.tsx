import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/check.svg";
import { middleTruncation } from "@/utils/strings";
import { clearReceiverAction, setIsInspectDetailAction } from "@redux/transaction/TransactionActions";

interface ReceiverThirdPartyCardProps {
  title: string;
  subTitle: string;
}

export default function ReceiverThirdPartyCard(props: ReceiverThirdPartyCardProps) {
  const { title, subTitle } = props;

  return (
    <div className="relative flex px-3 py-2 border rounded-md text-black-color dark:text-secondary-color-1-light border-slate-color-success dark:bg-secondary-color-2 bg-secondary-color-1-light">
      <CloseIcon
        className="absolute top-0 right-0 mt-1 mr-1 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        onClick={onRemoveReceiver}
      />
      <div className="mr-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-color-success">
          <CheckIcon className="w-2.5 h-2.5" />
        </div>
      </div>
      <div className="text-start">
        <p className="text-md">{title.length > 20 ? middleTruncation(title, 10, 10) : title}</p>
        <p className="opacity-50 text-md">{middleTruncation(subTitle, 20, 20)}</p>
      </div>
    </div>
  );

  function onRemoveReceiver() {
    clearReceiverAction();
    setIsInspectDetailAction(false);
  }
}
