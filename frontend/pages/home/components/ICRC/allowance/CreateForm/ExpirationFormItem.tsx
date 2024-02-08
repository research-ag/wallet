import { TAllowance } from "@/@types/allowance";
import { CalendarPicker } from "@components/CalendarPicker";
import { CheckBox } from "@components/checkbox";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IExpirationFormItemProps {
  allowance: TAllowance;
  setAllowanceState: (allowanceData: TAllowance) => void;
  isLoading?: boolean;
}

export default function ExpirationFormItem(props: IExpirationFormItemProps) {
  const { t } = useTranslation();
  const [noExpire, setNotExpire] = useState(true);
  const { setAllowanceState, isLoading, allowance } = props;

  const onDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    setAllowanceState({ ...allowance, expiration: date.format() });
  };

  const onExpirationChange = (checked: boolean) => {
    setNotExpire(checked);
    const date = dayjs().format();
    if (!checked) setAllowanceState({ ...allowance, noExpire: checked, expiration: date });
    if (checked) setAllowanceState({ ...allowance, noExpire: checked, expiration: "" });
  };

  return (
    <div className="mt-4">
      <label htmlFor="Expiration" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("expiration")}
      </label>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-4/6">
          <CalendarPicker
            onDateChange={onDateChange}
            disabled={noExpire || isLoading}
            value={dayjs(allowance.expiration)}
            onEnableChange={onExpirationChange}
          />
        </div>
        <div className="flex items-center justify-center h-full py-">
          <CheckBox
            className="mr-1 border-BorderColorLight dark:border-BorderColor"
            checked={noExpire}
            onClick={(e) => {
              e.preventDefault();
              onExpirationChange(!noExpire);
            }}
            disabled={isLoading}
          />
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("no.expiration")}</p>
        </div>
      </div>
    </div>
  );
}
