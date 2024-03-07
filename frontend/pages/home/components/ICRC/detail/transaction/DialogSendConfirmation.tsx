// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
//
import Modal from "@components/Modal";
import { CustomCopy } from "@components/CopyTooltip";
import { shortAddress } from "@/utils";
import { ProtocolType, SendingStatusEnum } from "@/const";
import { useTranslation } from "react-i18next";
import useSend from "@pages/home/hooks/useSend";
import { resetSendStateAction } from "@redux/transaction/TransactionActions";
import { TransactionValidationErrorsEnum } from "@/@types/transactions";
import { getElapsedSecond } from "@/utils/formatTime";
import { middleTruncation } from "@/utils/strings";

interface DialogSendConfirmationProps {
  setDrawerOpen(value: boolean): void;
  showConfirmationModal(value: boolean): void;
  modal: boolean;
  network: ProtocolType;
}

const DialogSendConfirmation = ({ setDrawerOpen, showConfirmationModal, modal }: DialogSendConfirmationProps) => {
  const { receiverPrincipal, receiverSubAccount, amount, sender, sendingStatus, errors, initTime, endTime } = useSend();
  const { t } = useTranslation();

  return (
    <Modal
      open={modal}
      width="w-[22rem]"
      padding="py-3 px-1"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
    >
      <div className="flex flex-col items-center justify-start w-full reative">
        <CloseIcon
          className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={onClose}
        />
        <div className="flex flex-col items-center justify-start w-full py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
          <div className="flex items-center justify-center p-2 border rounded-md border-BorderColorTwoLight dark:border-BorderColorTwo">
            <img src={UpAmountIcon} alt="send-icon" />
          </div>
          <p className="mt-3 text-lg font-semibold">{getStatusMessage(sendingStatus)}</p>
          {getError() !== "" && <p className="mt-1 text-md text-slate-color-error">{getError()}</p>}
          <div className="flex flex-row items-start justify-center w-full gap-4 mt-1 text-sm font-light opacity-80">
            <p>
              {sendingStatus === SendingStatusEnum.enum.done || sendingStatus === SendingStatusEnum.enum.error
                ? `Processing took ${getElapsedSecond(initTime, endTime)} seconds`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-row items-start justify-start w-full gap-4 py-4 pl-8 font-light opacity-50 text-md">
          <div className="flex flex-col items-start justify-start gap-2">
            <p>{`${t("principal")}:`}</p>
            <p>{`${t("acc.subacc")}:`}</p>
            <p>{`${t("amount")}:`}</p>
          </div>
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <p>{shortAddress(receiverPrincipal || "", 12, 10)}</p>
              <CustomCopy size={"small"} copyText={receiverPrincipal} />
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
              <p>{receiverSubAccount.length > 20 ? middleTruncation(receiverSubAccount, 10, 10) : receiverSubAccount}</p>
              <CustomCopy size={"small"} copyText={receiverSubAccount} />
            </div>
            <p>
              {amount} {sender?.asset?.symbol || ""}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );

  function onClose() {
    setDrawerOpen(false);
    showConfirmationModal(false);
    resetSendStateAction();
  }

  function getStatusMessage(status: string) {
    switch (status) {
      case SendingStatusEnum.enum.sending:
        return t("sending");
      case SendingStatusEnum.enum.done:
        return t("sending.successful");
      case SendingStatusEnum.enum.error:
        return t("sending.failed");
      default:
        return "";
    }
  }

  function getError() {
    switch (true) {
      case errors?.includes(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]):
        return t(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
      default:
        return "";
    }
  }
};

export default DialogSendConfirmation;
