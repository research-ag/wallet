import { BasicSwitch } from "@components/switch";
import { useTranslation } from "react-i18next";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { AllowanceContactBook } from "./AllowanceContactBook";
import SenderNewContact from "./SenderNewContact";
import {
  clearSenderAction,
  setIsNewSenderAction,
  setScannerActiveOptionAction,
} from "@redux/transaction/TransactionActions";
import { useAppSelector } from "@redux/Store";
import { TransactionScannerOptionEnum } from "@/@types/transactions";

export default function SenderAllowanceContact() {
  const { sender } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  return (
    <div>
      <label htmlFor="Spender" className="flex items-center justify-between mx-6 mb-2">
        <div className="flex items-center justify-between my-1 rounded-md bg-PrimaryColorLight dark:bg-ThemeColorBack">
          <p className="mr-1 opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {t("contact.book")}
          </p>
          <BasicSwitch checked={sender.isNewSender} onChange={onContactBookChange} disabled={false} />
          <p className="ml-1 opacity-50 text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {t("new")}
          </p>
        </div>
        {sender.isNewSender && <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />}
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
    setScannerActiveOptionAction(TransactionScannerOptionEnum.Values.sender);
  }
}