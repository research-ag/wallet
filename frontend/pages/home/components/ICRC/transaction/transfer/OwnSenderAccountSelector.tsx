import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logger from "@/common/utils/logger";
import formatSubAccount from "@/common/utils/formatSubAccount";
import { BasicSelect } from "@components/select";
import { SelectOption } from "@/@types/components";

export default function OwnSenderAccountSelector() {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const { transferState, setTransferState } = useTransfer();
  const [searchKey, setSearchKey] = useState<string | null>(null);

  return (
    <div className="max-w-[21rem] mx-auto">
      <p className="opacity-50 text-start text-md text-black-color dark:text-white">{t("subAccount")}</p>

      <BasicSelect
        onSelect={onSelect}
        options={getAccountOptions()}
        initialValue={transferState.fromSubAccount}
        currentValue={transferState.fromSubAccount}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
      />
    </div>
  );

  function getAccountOptions() {
    const selectedAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

    if (!selectedAsset) {
      logger.debug("OwnSenderAccountSelector: selectedAsset is null");
      return [];
    }

    if (!searchKey || searchKey.trim() == "")
      return selectedAsset.subAccounts.map((sub) => formatSubAccount(sub, selectedAsset));

    return selectedAsset.subAccounts
      .filter(
        (subAccount) =>
          subAccount?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          subAccount?.sub_account_id?.toLowerCase().includes(searchKey.toLowerCase()),
      )
      .map((sub) => formatSubAccount(sub, selectedAsset));
  }

  function onSelect(option: SelectOption) {
    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: option.value,
      fromPrincipal: userPrincipal.toString(),
    }));

    setSearchKey(null);
  }

  function onSearchChange(searchValue: string) {
    setSearchKey(searchValue);
  }

  function onOpenChange() {
    setSearchKey(null);
  }
}
