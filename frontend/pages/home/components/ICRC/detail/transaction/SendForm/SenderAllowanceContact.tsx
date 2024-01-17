import { useState } from "react";
import { Switch } from "@components/switch";
import { useTranslation } from "react-i18next";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { AllowanceContactBook } from "./AllowanceContactBook";
import NewContact from "./NewContact";
import { SenderInitialState, SetSenderAllowanceContact, SetSenderNewAllowanceContact } from "@/@types/transactions";

interface SenderAllowanceContactProps {
  sender: SenderInitialState;
  setSenderAllowanceContact: SetSenderAllowanceContact;
  setSenderNewAllowanceContact: SetSenderNewAllowanceContact;
}

export default function SenderAllowanceContact(props: SenderAllowanceContactProps) {
  const { t } = useTranslation();
  const [isNew, setIsNew] = useState(false);
  const { sender, setSenderAllowanceContact, setSenderNewAllowanceContact } = props;

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
      {isNew && <NewContact sender={sender} setSenderNewAllowanceContact={setSenderNewAllowanceContact} />}
      {!isNew && <AllowanceContactBook sender={sender} setSenderAllowanceContact={setSenderAllowanceContact} />}
    </div>
  );
}
