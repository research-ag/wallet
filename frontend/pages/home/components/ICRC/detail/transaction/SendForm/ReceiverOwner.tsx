import { ReceiverState, SenderState, SetReceiverOwnSubAccount } from "@/@types/transactions";
import { useMemo, useState } from "react";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import formatSubAccount from "@/utils/formatSubAccount";
import { SelectOption } from "@/@types/components";

interface ReceiverOwnerProps {
  setReceiverOwnSubAccount: SetReceiverOwnSubAccount;
  receiver: ReceiverState;
  sender: SenderState;
}

export default function ReceiverOwner(props: ReceiverOwnerProps) {
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { assets } = useAppSelector((state) => state.asset);

  const { setReceiverOwnSubAccount, receiver, sender } = props;

  const currentAsset = useMemo(() => {
    return assets.find((asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol);
  }, [assets, sender]);

  function onSelect(option: SelectOption) {
    const subAccount = currentAsset?.subAccounts.find((subAccount) => subAccount?.sub_account_id === option.value);
    if (!subAccount) return;
    setReceiverOwnSubAccount(subAccount);
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }

  const options = useMemo(() => {
    const subAccounts = currentAsset?.subAccounts;
    const filterValue = searchSubAccountValue?.toLowerCase().trim() || "";

    if (!subAccounts) return [];

    const isSenderOwnSubAccount = sender?.subAccount?.address;

    if (isSenderOwnSubAccount) {
      const filteredSubAccounts = subAccounts.filter(
        (subAccount) => subAccount?.sub_account_id !== sender?.subAccount?.sub_account_id,
      );

      return filteredSubAccounts
        .filter(
          (subAccount) =>
            subAccount?.name?.toLowerCase().includes(filterValue) ||
            subAccount?.symbol?.toLocaleLowerCase().includes(filterValue),
        )
        .map(formatSubAccount);
    }

    return subAccounts.map(formatSubAccount);

    // INFO: should a sub account be selected as default?
  }, [sender, currentAsset]);

  console.log(options);

  return (
    <Select
      onSelect={onSelect}
      options={options}
      initialValue={receiver?.ownSubAccount?.sub_account_id}
      currentValue={receiver?.ownSubAccount?.sub_account_id || ""}
      //   disabled={isLoading}
      //   border={error ? "error" : undefined}
      onSearch={onSearchChange}
      onOpenChange={onOpenChange}
    />
  );
}
