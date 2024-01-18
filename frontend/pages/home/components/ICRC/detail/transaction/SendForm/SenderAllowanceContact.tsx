import { useState } from "react";
import { Switch } from "@components/switch";
import { useTranslation } from "react-i18next";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { AllowanceContactBook } from "./AllowanceContactBook";
import SenderNewContact from "./SenderNewContact";

export default function SenderAllowanceContact() {
  const { t } = useTranslation();
  const [isNew, setIsNew] = useState(false);

  function onContactBookChange(checked: boolean) {
    setIsNew(checked);
  }

  return (
    <div className="mt-4">
      <label htmlFor="Spender" className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-between w-3/6 px-2 py-1 rounded-md bg-PrimaryColorLight dark:bg-ThemeColorBack">
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("contact.book")}</p>
          <Switch checked={isNew} onChange={onContactBookChange} disabled={false} />
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("new")}</p>
        </div>
        <QRScanIcon />
      </label>
      {isNew && <SenderNewContact />}
      {!isNew && <AllowanceContactBook />}
    </div>
  );
}
