import { Allowance } from "@/@types/allowance";
import { CheckBox } from "@components/core/checkbox";
import { DateTimePicker } from "@components/core/datepicker";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface IExpirationFormItemProps {
  allowance: Allowance;
  setAllowanceState: (allowanceData: Allowance) => void;
  isLoading?: boolean;
}

export default function ExpirationFormItem(props: IExpirationFormItemProps) {
  const [noExpire, setNotExpire] = useState(true);
  const { setAllowanceState, isLoading } = props;

  const onDateChange = (date: Dayjs) => {
    const ISODate = date.toISOString();
    setAllowanceState({ expiration: ISODate });
  };

  const onExpirationChange = (value: boolean) => {
    setNotExpire(value);
    setAllowanceState({ noExpire: value });
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
          />
        </div>
        <div className="flex items-center justify-center h-full py-">
          <CheckBox
            checked={noExpire}
            checkboxSize="small"
            onCheckedChange={onExpirationChange}
            className="relative right-2"
            disabled={isLoading}
          />
          <p className="text-md">No Expiration</p>
        </div>
      </div>
    </div>
  );
}
