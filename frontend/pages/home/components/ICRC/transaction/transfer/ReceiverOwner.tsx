import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectOption } from "@/@types/components";
import { BasicSelect } from "@components/select";
import { useAppSelector } from "@redux/Store";
import formatSubAccount from "@/common/utils/formatSubAccount";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";

export default function ReceiverOwner() {
  const { t } = useTranslation();
  const { setTransferState, transferState } = useTransfer();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [searchKey, setSearchKey] = useState<string | null>(null);

  const currentAsset = assets.find((asset) => asset?.tokenSymbol === transferState.tokenSymbol);

  return (
    <div className="max-w-[21rem] mx-auto py-[1rem]">
      <div className="relative">
        <p className="opacity-50 text-start text-md text-black-color dark:text-white">{t("subAccount")}</p>
        <BasicSelect
          onSelect={onSelect}
          options={getSubAccountOptions()}
          initialValue={transferState.toSubAccount}
          currentValue={transferState.toSubAccount}
          onSearch={onSearchChange}
          onOpenChange={onOpenChange}
          componentWidth="21rem"
        />
      </div>
    </div>
  );

  function getSubAccountOptions() {
    const subAccounts = currentAsset?.subAccounts;
    const filterValue = searchKey?.toLowerCase().trim() || "";

    if (!subAccounts) return [];

    const isSenderOwnSubAccount = transferState.fromType === TransferFromTypeEnum.own;

    if (isSenderOwnSubAccount) {
      const filteredSubAccounts = subAccounts.filter(
        (subAccount) => subAccount?.sub_account_id !== transferState.fromSubAccount,
      );

      return filteredSubAccounts
        .filter(
          (subAccount) =>
            subAccount?.name?.toLowerCase().includes(filterValue) ||
            subAccount?.symbol?.toLocaleLowerCase().includes(filterValue) ||
            filterValue === "",
        )
        .map((sub) => formatSubAccount(sub));
    }

    return subAccounts
      .filter(
        (subAccount) =>
          subAccount?.name?.toLowerCase().includes(filterValue) ||
          subAccount?.symbol?.toLocaleLowerCase().includes(filterValue) ||
          filterValue === "",
      )
      .map((sub) => formatSubAccount(sub));
  }

  function onSelect(option: SelectOption) {
    setTransferState((prev) => ({
      ...prev,
      toSubAccount: option.value,
      toPrincipal: userPrincipal.toString(),
      toType: TransferToTypeEnum.own,
    }));
  }

  function onSearchChange(searchValue: string) {
    setSearchKey(searchValue);
  }

  function onOpenChange() {
    setSearchKey(null);
  }
}
