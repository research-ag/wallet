import { SelectOption } from "@/@types/components";
import { SenderState, SetSenderSubAccount } from "@/@types/transactions";
import formatSubAccount from "@/utils/formatSubAccount";
import { Select } from "@components/select";
import { useMemo, useState } from "react";

export interface SenderSubAccountItemProps {
  sender: SenderState;
  setSenderSubAccount: SetSenderSubAccount;
}

export default function SenderSubAccount(props: SenderSubAccountItemProps) {
  const { sender, setSenderSubAccount } = props;
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!sender?.asset?.subAccounts) return [];
    if (!searchSubAccountValue) return sender.asset?.subAccounts.map(formatSubAccount);

    return sender.asset?.subAccounts
      .filter((subAccount) => subAccount?.name?.toLowerCase().includes(searchSubAccountValue.toLowerCase()))
      .map(formatSubAccount);
  }, [sender]);

  return (
    <Select
      onSelect={onSelect}
      options={options}
      initialValue={sender?.subAccount?.sub_account_id}
      currentValue={sender?.subAccount?.sub_account_id || ""}
      //   disabled={isLoading}
      //   border={error ? "error" : undefined}
      onSearch={onSearchChange}
      onOpenChange={onOpenChange}
    />
  );

  function onSelect(option: SelectOption) {
    const subAccount = sender?.asset?.subAccounts?.find((subAccount) => subAccount?.sub_account_id === option.value);
    if (!subAccount) return;
    setSenderSubAccount(subAccount);
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
