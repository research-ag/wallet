import { SelectOption } from "@/@types/components";
import formatSubAccount from "@/common/utils/formatSubAccount";
import { BasicSelect } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { setSenderSubAccountAction } from "@redux/transaction/TransactionActions";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SenderSubAccount() {
  const { t } = useTranslation();
  const { sender } = useAppSelector((state) => state.transaction);
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!sender?.asset?.subAccounts) return [];
    if (!searchSubAccountValue) return sender.asset?.subAccounts.map(formatSubAccount);

    return sender.asset?.subAccounts
      .filter((subAccount) => subAccount?.name?.toLowerCase().includes(searchSubAccountValue.toLowerCase()))
      .map(formatSubAccount);
  }, [sender, searchSubAccountValue]);

  return (
    <div className="mx-4">
      <p className="opacity-50 text-start text-md text-black-color dark:text-white">{t("subAccount")}</p>
      <BasicSelect
        onSelect={onSelect}
        options={options}
        initialValue={sender?.subAccount?.sub_account_id}
        currentValue={sender?.subAccount?.sub_account_id || ""}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        contentWidth="23rem"
      />
    </div>
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
