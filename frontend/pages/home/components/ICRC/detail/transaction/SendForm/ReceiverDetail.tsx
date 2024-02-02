import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/check.svg";
import { useAppSelector } from "@redux/Store";
import { middleTruncation } from "@/utils/strings";
import { clearReceiverAction, setIsInspectDetailAction } from "@redux/transaction/TransactionActions";

export default function ReceiverDetail() {
  const { receiver } = useAppSelector((state) => state.transaction);

  const title = `${
    receiver?.ownSubAccount?.name ||
    receiver?.thirdNewContact?.subAccountId ||
    `${receiver?.thirdContactSubAccount?.contactName} [${receiver?.thirdContactSubAccount?.subAccountId}]`
  }`;

  const subTitle = `${
    receiver?.ownSubAccount?.address ||
    receiver?.thirdContactSubAccount?.contactPrincipal ||
    receiver?.thirdNewContact?.principal
  }`;

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">To</p>
      <div className="relative flex px-3 py-2 border rounded-md border-slate-color-success bg-secondary-color-2">
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
          <p className="text-md">{title}</p>
          <p className="opacity-50 text-md">{middleTruncation(subTitle, 20, 20)}</p>
        </div>
      </div>
    </>
  );

  function onRemoveReceiver() {
    clearReceiverAction();
    setIsInspectDetailAction(false);
  }
}