import { TAllowance } from "@/@types/allowance";
import { CalendarPicker } from "@components/calendar";
import { BasicCheckBox } from "@components/checkbox";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface IExpirationFormItemProps {
  allowance: TAllowance;
  setAllowanceState: (allowanceData: TAllowance) => void;
  isLoading?: boolean;
}

export default function ExpirationFormItem(props: IExpirationFormItemProps) {
  const { t } = useTranslation();
  const { setAllowanceState, isLoading, allowance } = props;
  const hasExpiration = useMemo(() => Boolean(allowance?.expiration), [allowance]);

  return (
    <div className="mx-auto mt-4 w-[22rem]">
      <label htmlFor="Expiration" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("expiration")}
      </label>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-4/6">
          <CalendarPicker
            onDateChange={onDateChange}
            disabled={!hasExpiration || isLoading}
            value={dayjs(allowance.expiration)}
            onEnableChange={onExpirationChange}
          />
        </div>
        <div className="flex items-center justify-center h-full py-">
          <BasicCheckBox
            className="mr-1 border-BorderColorLight dark:border-BorderColor"
            checked={!hasExpiration}
            onClick={(e) => {
              e.preventDefault();
              onExpirationChange();
            }}
            disabled={isLoading}
          />
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("no.expiration")}</p>
        </div>
      </div>
    </div>
  );

  function onDateChange(date: dayjs.Dayjs | null) {
    if (!date) return;
    setAllowanceState({ ...allowance, expiration: date.format() });
  }

  function onExpirationChange() {
    if (!hasExpiration) setAllowanceState({ ...allowance, expiration: dayjs().format() });
    if (hasExpiration) setAllowanceState({ ...allowance, expiration: "" });
  }
}
