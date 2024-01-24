// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
//
import Modal from "@components/Modal";
import { CustomCopy } from "@components/CopyTooltip";
import { shortAddress } from "@/utils";
import { SendingStatus, SendingStatusEnum } from "@/const";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/Store";
import useSend from "@pages/home/hooks/useSend";

interface DialogSendConfirmationProps {
  setDrawerOpen(value: boolean): void;
  showConfirmationModal(value: boolean): void;
  modal: boolean;
  sendingStatus: SendingStatus;
}

const DialogSendConfirmation = ({
  setDrawerOpen,
  showConfirmationModal,
  modal,
  sendingStatus,
}: DialogSendConfirmationProps) => {
  const { receiverPrincipal, receiverSubAccount, amount } = useSend();
  const { sender } = useAppSelector((state) => state.transaction);
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
              <p>{receiverSubAccount}</p>
              <CustomCopy size={"small"} copyText={receiverSubAccount} />
            </div>
            <p>
              {amount} ${sender?.asset?.symbol || ""}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );

  function onClose() {
    setDrawerOpen(false);
    showConfirmationModal(false);
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
};

export default DialogSendConfirmation;
