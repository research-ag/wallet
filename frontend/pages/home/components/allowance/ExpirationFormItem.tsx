import { Allowance, ErrorFields } from "@/@types/allowance";
import { ValidationErrors } from "@/@types/common";
import { CheckBox } from "@components/checkbox";
import { DateTimePicker } from "@components/core/datepicker";
import { Dayjs } from "dayjs";
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

  const onDateChange = (date: Dayjs) => {
    const ISODate = date.toISOString();
    setAllowanceState({ ...allowance, expiration: ISODate });
  };

  const onExpirationChange = (value: boolean) => {
    setNotExpire(value);
    setAllowanceState({ ...allowance, noExpire: value });
  };

  return (
    <div className="mt-4">
      <label htmlFor="Expiration" className="text-lg">
        Expiration
      </label>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-4/6 mt-">
          <DateTimePicker
            onChange={onDateChange}
            enabled={!noExpire && !isLoading}
            onEnableChange={onExpirationChange}
            border={error ? "error" : undefined}
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
          <p className="text-md">No Expiration</p>
        </div>
      </div>
    </div>
  );
}
