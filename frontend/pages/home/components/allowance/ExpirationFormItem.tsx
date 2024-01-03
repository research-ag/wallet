import { Allowance, ErrorFields } from "@/@types/allowance";
import { ValidationErrors } from "@/@types/common";
import { CalendarPicker } from "@components/CalendarPicker";
import { CheckBox } from "@components/checkbox";
import dayjs from "dayjs";
import { useState } from "react";

interface IExpirationFormItemProps {
  allowance: Allowance;
  setAllowanceState: (allowanceData: Allowance) => void;
  isLoading?: boolean;
  errors?: ValidationErrors[];
}

export default function ExpirationFormItem(props: IExpirationFormItemProps) {
  const [noExpire, setNotExpire] = useState(true);
  const { setAllowanceState, isLoading, allowance, errors } = props;
  const error = errors?.filter((error) => error.field === ErrorFields.expiration)[0];

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
      <label htmlFor="Expiration" className="text-lg">
        Expiration
      </label>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-4/6 mt-">
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
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">No Expiration</p>
        </div>
      </div>
    </div>
  );
}
