import { Switch } from "@components/switch";
import { useTranslation } from "react-i18next";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { AllowanceContactBook } from "./AllowanceContactBook";
import SenderNewContact from "./SenderNewContact";
import { ScannerOption } from "@/@types/transactions";
import {
  clearSenderAction,
  setIsNewSenderAction,
  setScannerActiveOptionAction,
} from "@redux/transaction/TransactionActions";
import { useAppSelector } from "@redux/Store";

export default function SenderAllowanceContact() {
  const { sender } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <label htmlFor="Spender" className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-between w-3/6 px-2 py-1 rounded-md bg-PrimaryColorLight dark:bg-ThemeColorBack">
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("contact.book")}</p>
          <Switch checked={sender.isNewSender} onChange={onContactBookChange} disabled={false} />
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("new")}</p>
        </div>
        <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />
      </label>
      {sender.isNewSender && <SenderNewContact />}
      {!sender.isNewSender && <AllowanceContactBook />}
    </div>
  );

  function onContactBookChange(checked: boolean) {
    setIsNewSenderAction(checked);
    clearSenderAction();
  }

  function onSenderScannerShow() {
    setScannerActiveOptionAction(ScannerOption.sender);
  }
}
