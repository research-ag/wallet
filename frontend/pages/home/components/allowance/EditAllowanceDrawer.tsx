import { Chip } from "@components/core/chip";
import { Drawer } from "@components/core/drawer";
import LoadingLoader from "@components/Loader";
import { middleTruncation } from "@/utils/strings";
import Button from "@components/core/buttons/Button";
import { Allowance } from "@/@types/allowance";
import { Asset } from "@redux/models/AccountModels";
import { CurrencyInput } from "@components/core/input";
import { getAssetIcon } from "@/utils/icons";
import { IconTypeEnum } from "@/const";
import { useCallback, useMemo } from "react";
import { DateTimePicker } from "@components/core/datepicker";
import { CheckBox } from "@components/core/checkbox";
import { Dayjs } from "dayjs";
import { useUpdateAllowance } from "@pages/home/hooks/useAllowanceMutation";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

export default function EditAllowanceDrawer(props: IAllowanceDrawerProps) {
  const { allowance, setAllowanceState, updateAllowance, isPending } = useUpdateAllowance();
  const { isDrawerOpen, onClose } = props;

  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title="Edit Allowance">
      {allowance && <UpdateForm />}
      {!allowance && <LoadingComponent />}
    </Drawer>
  );

  function UpdateForm() {
    return (
      <form className="flex flex-col text-left">
        <div className="w-full bg-[#141331] rounded-md p-4">
          <p className="text-lg font-bold">Subaccount</p>
          <div className="flex items-center mt-4">
            <div className="flex flex-col items-start justify-center mr-4">
              {getAssetIcon(IconTypeEnum.Enum.ASSET, allowance.asset?.tokenSymbol, allowance.asset?.logo)}
              <p className="mt-2">{allowance.asset?.tokenSymbol}</p>
            </div>

            <div className="flex items-center justify-start">
              <Chip size="medium" text="0x1" className="mr-2" />
              <p>Regional School</p>
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

        <AmountFormItem allowance={allowance} isLoading={isPending} />

        <ExpirationFormItem allowance={allowance} setAllowanceState={setAllowanceState} isLoading={isPending} />

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
  function LoadingComponent() {
    return (
      <div className="grid h-80 place-items-center">
        <LoadingLoader />
      </div>
    );
  }
  function AmountFormItem(props: IAmountFormItemProps) {
    const { allowance, selectedAsset, isLoading } = props;
    const { asset } = allowance;

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
        />
      </div>
    );
  }
  function ExpirationFormItem(props: IExpirationFormItemProps) {
    const { isLoading, allowance, setAllowanceState } = props;

    const handleDateChange = useCallback(
      (date: Dayjs) => {
        setAllowanceState({ expiration: date.toISOString() });
      },
      [allowance, setAllowanceState],
    );

    const handleExpirationChange = useCallback(
      (checked: boolean) => {
        if (checked) setAllowanceState({ noExpire: checked });
        setAllowanceState({ noExpire: checked, expiration: "" });
      },
      [allowance, setAllowanceState],
    );

    return (
      <div className="mt-4">
        <label htmlFor="Expiration" className="text-lg">
          Expiration
        </label>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="w-4/6 mt-">
            <DateTimePicker
              onChange={handleDateChange}
              enabled={!allowance.noExpire && !isLoading}
              onEnableChange={handleExpirationChange}
              ISODate={allowance?.expiration || undefined}
            />
          </div>
          <div className="flex items-center justify-center h-full py-">
            <CheckBox
              checked={Boolean(allowance.noExpire)}
              checkboxSize="small"
              onCheckedChange={handleExpirationChange}
              className="relative right-2"
              disabled={isLoading}
            />
            <p className="text-md">No Expiration</p>
          </div>
        </div>
      </div>
    );
  }
}

interface IAmountFormItemProps {
  allowance: Allowance;
  selectedAsset?: Asset | undefined;
  isLoading?: boolean;
}

interface IExpirationFormItemProps {
  allowance: Allowance;
  isLoading?: boolean;
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
}
