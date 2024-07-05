// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
//
import { BasicModal } from "@components/modal";
import { CustomCopy } from "@components/tooltip";
import { middleTruncation } from "@/common/utils/strings";
import { shortAddress } from "@common/utils/icrc";

import { TransferStatus, useTransferStatus } from "@pages/home/contexts/TransferStatusProvider";
import { useTranslation } from "react-i18next";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { TransactionDrawer } from "@/@types/transactions";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";

export default function TransferStatusModal() {
  const { t } = useTranslation();
  const { status, setStatus } = useTransferStatus();
  const { transferState, setTransferState } = useTransfer();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  const isOpen = status !== TransferStatus.NONE;

  return (
    <BasicModal
      open={isOpen}
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
          <p className="mt-3 text-lg font-semibold">{getStatusMessage(status)}</p>

          {/* {getError() !== "" && <p className="mt-1 text-md text-slate-color-error">{getError()}</p>} */}

          <div className="flex flex-row items-start justify-center w-full gap-4 mt-1 text-sm font-light opacity-80">
            <p>
              {status === TransferStatus.DONE || status === TransferStatus.ERROR
                ? `Processing took ${transferState.duration} seconds`
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
              <p>{shortAddress(transferState.toPrincipal || "", 12, 10)}</p>
              <CustomCopy size={"small"} copyText={transferState.toPrincipal} />
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
              <p>
                {transferState.toSubAccount.length > 20
                  ? middleTruncation(transferState.toSubAccount, 10, 10)
                  : transferState.toSubAccount}
              </p>
              <CustomCopy size={"small"} copyText={transferState.toSubAccount} />
            </div>
            <p>
              {transferState.amount} {currentAsset?.symbol || ""}
            </p>
          </div>
        </div>
      </div>
    </BasicModal>
  );

  function onClose() {
    setTransactionDrawerAction(TransactionDrawer.NONE);
    setTransferState({
      tokenSymbol: "",
      fromType: TransferFromTypeEnum.own,
      fromPrincipal: "",
      fromSubAccount: "",
      toType: TransferToTypeEnum.own,
      toPrincipal: "",
      toSubAccount: "",
      amount: "",
      usdAmount: "",
      duration: "",
    });
    setStatus(TransferStatus.NONE);
  }

  function getStatusMessage(status: string) {
    switch (status) {
      case TransferStatus.SENDING:
        return t("sending");
      case TransferStatus.DONE:
        return t("transfer.successful");
      case TransferStatus.ERROR:
        return t("sending.failed");
      default:
        return "";
    }
  }
}
