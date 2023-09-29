// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
//
import Modal from "@components/Modal";
import { CustomCopy } from "@components/CopyTooltip";
import { shortAddress, subUint8ArrayToHex, toFullDecimal } from "@/utils";
import { SendingStatus, SendingStatusEnum } from "@/const";
import { useTranslation } from "react-i18next";
import { Asset, SubAccount } from "@redux/models/AccountModels";

interface DialogSendConfirmationProps {
  setDrawerOpen(value: boolean): void;
  showModal(value: boolean): void;
  modal: boolean;
  receiver: any;
  sendingStatus: SendingStatus;
  amount: string;
  selectedAccount: SubAccount | undefined;
  selectedAsset: Asset | undefined;
}

const DialogSendConfirmation = ({
  setDrawerOpen,
  showModal,
  modal,
  receiver,
  sendingStatus,
  amount,
  selectedAccount,
  selectedAsset,
}: DialogSendConfirmationProps) => {
  const { t } = useTranslation();

  const getStatusMessage = (status: string) => {
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
  };

  return (
    <Modal
      open={modal}
      width="w-[22rem]"
      padding="py-3 px-1"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
    >
      <div className="reative flex flex-col justify-start items-center w-full">
        <CloseIcon
          className="absolute top-5 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setDrawerOpen(false);
            showModal(false);
          }}
        />
        <div className="flex flex-col justify-start items-center w-full py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
          <div className="flex justify-center items-center p-2 rounded-md border border-BorderColorTwoLight dark:border-BorderColorTwo">
            <img src={UpAmountIcon} alt="send-icon" />
          </div>
          <p className="text-lg font-semibold mt-3">{getStatusMessage(sendingStatus)}</p>
        </div>
        <div className="flex flex-row justify-start items-start w-full pl-8 font-light opacity-50 text-md gap-4 py-4">
          <div className="flex flex-col justify-start items-start gap-2">
            <p>{`${t("principal")}:`}</p>
            <p>{`${t("acc.subacc")}:`}</p>
            <p>{`${t("amount")}:`}</p>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{shortAddress(receiver?.icrcAccount?.owner.toText() || "", 12, 10)}</p>
              <CustomCopy size={"small"} copyText={receiver.icrcAccount.owner.toText()} />
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`0x${subUint8ArrayToHex(receiver?.icrcAccount?.subaccount || "")}`}</p>
              <CustomCopy size={"small"} copyText={subUint8ArrayToHex(receiver?.icrcAccount?.subaccount || "")} />
            </div>
            <p>{`${toFullDecimal(amount, selectedAccount?.decimal || 0)} ${selectedAsset?.symbol || ""}`}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DialogSendConfirmation;
