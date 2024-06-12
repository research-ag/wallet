import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
//
import { BasicSwitch } from "@components/switch";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AllowanceSenderContactBook from "./AllowanceSenderContactBook";
import AllownaceSenderInputs from "./AllowanceSenderInputs";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";

export default function AllowanceSenderAccountSelector() {
  const { setView } = useTransferView();
  const { t } = useTranslation();
  const { setTransferState } = useTransfer();
  const [isSenderNew, setIsSenderNew] = useState(false);

  return (
    <div>
      <label htmlFor="Spender" className="flex items-center justify-between mx-6 mb-2">
        <div className="flex items-center justify-between my-1 rounded-md dark:bg-ThemeColorBack">
          <p className="mr-1 opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {t("contact.book")}
          </p>
          <BasicSwitch checked={isSenderNew} onChange={onContactBookChange} disabled={false} />
          <p className="ml-1 opacity-50 text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {t("new")}
          </p>
        </div>
        {isSenderNew && <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />}
      </label>
      {isSenderNew && <AllownaceSenderInputs />}
      {!isSenderNew && <AllowanceSenderContactBook />}
    </div>
  );

  function onContactBookChange(checked: boolean) {
    setIsSenderNew(checked);
    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: "",
      fromPrincipal: "",
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
