import { Allowance } from "@/@types/allowance";
import { SelectOption } from "@/@types/core";
import { Chip } from "@components/core/chip";
import { Select } from "@components/core/select";
import { Asset } from "@redux/models/AccountModels";
import { useMemo } from "react";

interface ISubAccountFormItemProps {
  allowance: Allowance;
  selectedAsset: Asset | undefined;
  setAllowanceState: (allowanceData: Allowance) => void;
  isLoading?: boolean;
}

export default function SubAccountFormItem(props: ISubAccountFormItemProps) {
  const { allowance, selectedAsset, setAllowanceState, isLoading } = props;
  const { subAccount } = allowance;

  const options = useMemo(() => {
    if (allowance?.asset?.subAccounts.length > 0)
      return allowance?.asset?.subAccounts.map((account) => {
        return {
          value: account?.sub_account_id,
          label: account?.name,
          icon: <Chip text={account.sub_account_id} size="medium" className="mr-4" />,
        };
      });

    if (selectedAsset?.subAccounts?.length) {
      return selectedAsset?.subAccounts?.map((account) => {
        return {
          value: account?.sub_account_id,
          label: account?.name,
          icon: <Chip text={account.sub_account_id} size="medium" className="mr-4" />,
        };
      });
    }

    return [];
  }, [allowance.asset]);

  const onChange = (option: SelectOption) => {
    const fullSubAccount = allowance?.asset?.subAccounts.find((account) => account.sub_account_id === option.value);
    setAllowanceState({ subAccount: fullSubAccount });
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
      />
    </div>
  );
}
