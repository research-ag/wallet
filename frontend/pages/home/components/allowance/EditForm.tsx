import { middleTruncation } from "@/utils/strings";
import Button from "@components/buttons/Button";
import { Allowance, ErrorFields } from "@/@types/allowance";
import { Asset } from "@redux/models/AccountModels";
import { CurrencyInput } from "@components/input";
import { getAssetIcon } from "@/utils/icons";
import { IconTypeEnum } from "@/const";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useUpdateAllowance } from "@pages/home/hooks/useUpdateAllowance";
import { ValidationErrors } from "@/@types/common";
import { Chip } from "@components/chip";
import { CheckBox } from "@components/checkbox";
import { CalendarPicker } from "@components/CalendarPicker";

export default function UpdateForm() {
  const { allowance, setAllowanceState, updateAllowance, isPending, validationErrors } = useUpdateAllowance();

  return (
    <form className="flex flex-col text-left">
      <FixedFields allowance={allowance} />

      <AmountFormItem
        allowance={allowance}
        isLoading={isPending}
        errors={validationErrors}
        setAllowanceState={setAllowanceState}
      />

      <ExpirationFormItem
        allowance={allowance}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
        errors={validationErrors}
      />

      <div className="flex justify-end mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            updateAllowance();
          }}
          className="w-1/4"
          disabled={isPending}
          isLoading={isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

interface FixedFieldsProps {
  allowance: Allowance;
}

function FixedFields({ allowance }: FixedFieldsProps) {
  return (
    <div className="w-full bg-[#141331] rounded-md p-4">
      <p className="text-lg font-bold">Subaccount</p>
      <div className="flex items-center mt-4">
        <div className="flex flex-col items-start justify-center mr-4">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, allowance.asset?.tokenSymbol, allowance.asset?.logo)}
          <p className="mt-2">{allowance.asset?.tokenSymbol}</p>
        </div>

        <div className="flex items-center justify-start">
          <Chip size="medium" text={allowance.subAccount.sub_account_id || ""} className="mr-2" />
          <p>{allowance.subAccount.name}</p>
        </div>
      </div>

      <div className="w-full h-0.5 bg-[#2B2B3D] mt-4 mb-4" />
      <p className="text-lg font-bold">Spender</p>

      <div className="flex justify-between mt-4">
        <p>Principal</p>
        <p>{middleTruncation(allowance?.spender?.principal, 5, 5)}</p>
      </div>

      <div className="flex justify-between mt-4">
        <p>Name</p>
        <p>{allowance?.spender?.name}</p>
      </div>
    </div>
  );
}

interface IAmountFormItemProps {
  allowance: Allowance;
  selectedAsset?: Asset | undefined;
  isLoading?: boolean;
  errors: ValidationErrors[];
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
}

function AmountFormItem(props: IAmountFormItemProps) {
  const { allowance, selectedAsset, isLoading, errors, setAllowanceState } = props;
  const { asset } = allowance;

  const error = errors?.filter((error) => error.field === ErrorFields.amount)[0];

  const { icon, symbol } = useMemo(() => {
    const symbol = asset?.tokenSymbol || selectedAsset?.tokenSymbol || "";
    const logo = asset?.logo || selectedAsset?.logo;
    return {
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, symbol, logo),
      symbol,
    };
  }, [allowance, selectedAsset]);

  const onAmountChange = (amount: string) => {
    setAllowanceState({ amount });
  };

  return (
    <div className="mt-4">
      <label htmlFor="Amount" className="text-lg">
        Amount
      </label>
      <CurrencyInput
        onCurrencyChange={onAmountChange}
        currency={symbol}
        icon={icon}
        className="mt-2"
        isLoading={isLoading}
        value={allowance.amount}
        border={error ? "error" : undefined}
      />
    </div>
  );
}

interface IExpirationFormItemProps {
  allowance: Allowance;
  isLoading?: boolean;
  errors: ValidationErrors[];
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
}

function ExpirationFormItem(props: IExpirationFormItemProps) {
  const { isLoading, allowance, setAllowanceState, errors } = props;
  const error = errors?.filter((error) => error.field === ErrorFields.expiration)[0];

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
          <p className="text-md">No Expiration</p>
        </div>
      </div>
    </div>
  );
}
