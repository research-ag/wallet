import { TAllowance, AllowanceErrorFieldsEnum } from "@/@types/allowance";
import { TErrorValidation } from "@/@types/common";
import { SelectOption } from "@/@types/components";
import { Chip } from "@components/chip";
import { Select } from "@components/select";
import { Asset } from "@redux/models/AccountModels";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface ISubAccountFormItemProps {
  allowance: TAllowance;
  selectedAsset: Asset | undefined;
  isLoading?: boolean;
  errors?: TErrorValidation[];
  setAllowanceState: (allowanceData: TAllowance) => void;
}

export default function SubAccountFormItem(props: ISubAccountFormItemProps) {
  const { t } = useTranslation();
  const { allowance, selectedAsset, setAllowanceState, isLoading, errors } = props;
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const onOpenChange = () => setSearchValue(null);
  const onSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  const { subAccount } = allowance;

  const error = errors?.filter((error) => error.field === AllowanceErrorFieldsEnum.Values.subAccount)[0];

  const options = useMemo(() => {
    const accountsToMap = searchValue
      ? allowance?.asset?.subAccounts?.filter((account) =>
          account.name.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : allowance?.asset?.subAccounts || selectedAsset?.subAccounts;

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
        initialValue={allowance?.subAccount?.sub_account_id}
        currentValue={subAccount?.sub_account_id || ""}
        disabled={isLoading}
        border={error ? "error" : undefined}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
      />
    </div>
  );

  function onChange(option: SelectOption) {
    setSearchValue(null);
    const fullSubAccount = allowance?.asset?.subAccounts.find((account) => account.sub_account_id === option.value);

    if (!fullSubAccount || !fullSubAccount.address) return;
    setAllowanceState({ ...allowance, subAccount: fullSubAccount });
  }
}
