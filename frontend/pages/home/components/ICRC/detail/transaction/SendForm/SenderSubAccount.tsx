import { SelectOption } from "@/@types/components";
import formatSubAccount from "@/utils/formatSubAccount";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { setSenderSubAccountAction } from "@redux/transaction/TransactionActions";
import { useMemo, useState } from "react";

export default function SenderSubAccount() {
  const { sender } = useAppSelector((state) => state.transaction);
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!sender?.asset?.subAccounts) return [];
    if (!searchSubAccountValue) return sender.asset?.subAccounts.map(formatSubAccount);

    return sender.asset?.subAccounts
      .filter((subAccount) => subAccount?.name?.toLowerCase().includes(searchSubAccountValue.toLowerCase()))
      .map(formatSubAccount);
  }, [sender, searchSubAccountValue]);

  // TODO: if not own sender selected show error bordered

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
    setSenderSubAccountAction(subAccount);
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
