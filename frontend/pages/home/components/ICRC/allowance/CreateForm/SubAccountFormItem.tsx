import { TAllowance, AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { SelectOption } from "@/@types/components";
import { Chip } from "@components/chip";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface ISubAccountFormItemProps {
  allowance: TAllowance;
  selectedAsset: Asset | undefined;
  isLoading?: boolean;
  setAllowanceState: (allowanceData: TAllowance) => void;
}

export default function SubAccountFormItem(props: ISubAccountFormItemProps) {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.allowance);
  const { assets } = useAppSelector((state) => state.asset);
  const { allowance, selectedAsset, setAllowanceState, isLoading } = props;
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const onOpenChange = () => setSearchValue(null);
  const onSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  const { subAccountId } = allowance;

  const allowanceAsset = useMemo(
    () => assets.find((asset) => asset.tokenSymbol === allowance.asset.tokenSymbol),
    [assets, allowance],
  );

  const options = useMemo(() => {
    const accountsToMap = searchValue
      ? allowanceAsset?.subAccounts?.filter((account) => account.name.toLowerCase().includes(searchValue.toLowerCase()))
      : allowanceAsset?.subAccounts || selectedAsset?.subAccounts;

    return (
      accountsToMap?.map((account) => ({
        value: account?.sub_account_id,
        label: account?.name,
        icon: <Chip text={account.sub_account_id} size="medium" className="mr-4" />,
      })) || []
    );
  }, [allowance.asset, searchValue, selectedAsset]);

  return (
    <div className="mt-4">
      <label htmlFor="Subaccount" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("subAccount")}
      </label>

      <Select
        onSelect={onChange}
        options={options}
        initialValue={allowance?.subAccountId}
        currentValue={subAccountId || ""}
        disabled={isLoading}
        border={isError() ? "error" : undefined}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
      />
    </div>
  );

  function onChange(option: SelectOption) {
    setSearchValue(null);
    const fullSubAccount = allowanceAsset?.subAccounts.find((account) => account.sub_account_id === option.value);
    if (!fullSubAccount || !fullSubAccount.address) return;
    setAllowanceState({ ...allowance, subAccountId: fullSubAccount.sub_account_id });
  }

  function isError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]) || false;
  }
}
