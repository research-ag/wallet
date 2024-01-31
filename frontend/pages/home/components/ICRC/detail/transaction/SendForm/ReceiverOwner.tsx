import { useMemo, useState } from "react";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import formatSubAccount from "@/utils/formatSubAccount";
import { SelectOption } from "@/@types/components";
import { setReceiverOwnSubAccountAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";

export default function ReceiverOwner() {
  const { t } = useTranslation();
  const { sender, receiver } = useAppSelector((state) => state.transaction);
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { assets } = useAppSelector((state) => state.asset);

  const currentAsset = useMemo(() => {
    return assets.find((asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol);
  }, [assets, sender]);

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
  }, [sender, currentAsset]);

  return (
    <div className="mx-4 mt-4">
      <div>
        <p className="opacity-50 text-start text-black-color dark:text-white">{t("subAccount")}</p>
        <Select
          onSelect={onSelect}
          options={options}
          initialValue={receiver?.ownSubAccount?.sub_account_id}
          currentValue={receiver?.ownSubAccount?.sub_account_id || ""}
          onSearch={onSearchChange}
          onOpenChange={onOpenChange}
          contentWidth="23rem"
        />
      </div>
    </div>
  );

  function onSelect(option: SelectOption) {
    const subAccount = currentAsset?.subAccounts.find((subAccount) => subAccount?.sub_account_id === option.value);
    if (!subAccount) return;
    setReceiverOwnSubAccountAction(subAccount);
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
