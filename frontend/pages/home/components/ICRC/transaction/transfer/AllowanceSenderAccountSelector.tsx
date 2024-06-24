import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
//
import { BasicSwitch } from "@components/switch";
import { TransferFromTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useTranslation } from "react-i18next";
import AllowanceSenderContactBook from "@/pages/home/components/ICRC/transaction/transfer/AllowanceSenderContactBook";
import AllownaceSenderInputs from "@/pages/home/components/ICRC/transaction/transfer/AllowanceSenderInputs";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";

export default function AllowanceSenderAccountSelector() {
  const { setView } = useTransferView();
  const { t } = useTranslation();
  const { setTransferState, transferState } = useTransfer();

  const isManual = transferState.fromType === TransferFromTypeEnum.allowanceManual;

  return (
    <div>
      <label htmlFor="Spender" className="flex items-center justify-between mx-6 mb-2">
        <div className="flex items-center justify-between my-1 rounded-md dark:bg-ThemeColorBack">
          <p className="mr-1 opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {t("contact.book")}
          </p>
          <BasicSwitch checked={isManual} onChange={onContactBookChange} disabled={false} />
          <p className="ml-1 opacity-50 text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {t("new")}
          </p>
        </div>
        {isManual && <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />}
      </label>
      {isManual && <AllownaceSenderInputs />}
      {!isManual && <AllowanceSenderContactBook />}
    </div>
  );

  function onContactBookChange(checked: boolean) {
    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: "",
      fromPrincipal: "",
      fromType: checked ? TransferFromTypeEnum.allowanceManual : TransferFromTypeEnum.allowanceContactBook,
    }));
  }

  function onSenderScannerShow() {
    setView(TransferView.SENDER_QR_SCANNER);
    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: "",
      fromPrincipal: "",
    }));
  }
}
