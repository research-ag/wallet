import { TAllowance, AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { SelectOption } from "@/@types/components";
import { BasicChip } from "@components/chip";
import { BasicSelect } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
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
  const { assets } = useAppSelector((state) => state.asset.list);
  const { allowance, setAllowanceState, isLoading } = props;
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
    if (!searchValue) return allowanceAsset?.subAccounts.map(formatSubAccount) || [];

    const filteredSubAccounts =
      allowanceAsset?.subAccounts.filter((account) => account.name.toLowerCase().includes(searchValue.toLowerCase())) ||
      [];

    return filteredSubAccounts.map(formatSubAccount);
  }, [allowance.asset, searchValue, allowanceAsset]);

  function formatSubAccount(subAccount: SubAccount) {
    return {
      value: subAccount.sub_account_id,
      label: subAccount.name,
      icon: <BasicChip text={subAccount.sub_account_id} size="medium" className="mr-4" />,
    };
  }

  return (
    <div className="mx-auto mt-4 w-[22rem]">
      <label htmlFor="Subaccount" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("subAccount")}
      </label>

      <BasicSelect
        onSelect={onChange}
        options={options}
        initialValue={allowance?.subAccountId}
        currentValue={subAccountId || ""}
        disabled={isLoading}
        border={isError() ? "error" : undefined}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="22rem"
      />
    </div>
  );

  function onChange(option: SelectOption) {
    setSearchValue(null);
    const fullSubAccount = allowanceAsset?.subAccounts.find((account) => account.sub_account_id === option.value);
    if (!fullSubAccount) return;
    setAllowanceState({ ...allowance, subAccountId: fullSubAccount.sub_account_id });
  }

  function isError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]) || false;
  }
}
