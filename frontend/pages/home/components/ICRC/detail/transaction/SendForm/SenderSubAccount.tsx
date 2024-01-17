import { SelectOption } from "@/@types/components";
import formatSubAccount from "@/utils/formatSubAccount";
import { Select } from "@components/select";
import { SenderInitialState } from "@pages/home/hooks/useSender";
import { SubAccount } from "@redux/models/AccountModels";
import { useMemo, useState } from "react";

interface SenderItemProps {
  sender: SenderInitialState;
  setSenderSubAccount: (subAccount: SubAccount) => void;
}

export default function SenderSubAccount(props: SenderItemProps) {
  const { sender, setSenderSubAccount } = props;
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);

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
}
