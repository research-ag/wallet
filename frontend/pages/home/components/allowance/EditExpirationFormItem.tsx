import { TAllowance } from "@/@types/allowance";
import { TErrorValidation } from "@/@types/common";
import { CalendarPicker } from "@components/CalendarPicker";
import { CheckBox } from "@components/checkbox";
import dayjs from "dayjs";

interface IExpirationFormItemProps {
  allowance: TAllowance;
  isLoading?: boolean;
  errors?: TErrorValidation[];
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
}

export default function EditExpirationFormItem(props: IExpirationFormItemProps) {
  const { isLoading, allowance, setAllowanceState } = props;

  const onDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    setAllowanceState({ ...allowance, expiration: date.format() });
  };

  const onExpirationChange = (checked: boolean) => {
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
            disabled={allowance.noExpire || isLoading}
            value={dayjs(allowance.expiration)}
            onEnableChange={onExpirationChange}
          />
        </div>
        <div className="flex items-center justify-center h-full py-">
          <CheckBox
            checked={Boolean(allowance.noExpire)}
            size="small"
            onClick={(e) => {
              e.preventDefault();
              onExpirationChange(!allowance.noExpire);
            }}
            className="mr-1 border-BorderColorLight dark:border-BorderColor"
            disabled={isLoading}
          />
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">No Expiration</p>
        </div>
      </div>
    </div>
  );
}
