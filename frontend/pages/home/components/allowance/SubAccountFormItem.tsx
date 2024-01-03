import { Allowance, ErrorFields } from "@/@types/allowance";
import { ValidationErrors } from "@/@types/common";
import { SelectOption } from "@/@types/core";
import { Chip } from "@components/chip";
import { Select } from "@components/select";
import { Asset } from "@redux/models/AccountModels";
import { useMemo, useState } from "react";

interface ISubAccountFormItemProps {
  allowance: Allowance;
  selectedAsset: Asset | undefined;
  isLoading?: boolean;
  errors?: ValidationErrors[];
  setAllowanceState: (allowanceData: Allowance) => void;
}

export default function SubAccountFormItem(props: ISubAccountFormItemProps) {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const { allowance, selectedAsset, setAllowanceState, isLoading, errors } = props;
  const { subAccount } = allowance;

  const error = errors?.filter((error) => error.field === ErrorFields.subAccount)[0];

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

  const onChange = (option: SelectOption) => {
    const fullSubAccount = allowance?.asset?.subAccounts.find((account) => account.sub_account_id === option.value);

    if (!fullSubAccount || !fullSubAccount.address) return;
    setAllowanceState({ ...allowance, subAccount: fullSubAccount });
  };

  const onSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  return (
    <div className="mt-4">
      <label htmlFor="Subaccount" className="text-lg">
        Subaccount
      </label>

      <Select
        onSelect={onChange}
        options={options}
        initialValue={allowance?.subAccount?.sub_account_id}
        currentValue={subAccount?.sub_account_id || ""}
        disabled={isLoading}
        border={error ? "error" : undefined}
        onSearch={onSearchChange}
      />
    </div>
  );
}
