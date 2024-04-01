// svgs
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
import DownAmountIcon from "@assets/svg/files/down-amount-icon.svg";
//
import { TransactionDrawer } from "@/@types/transactions";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { BasicDrawer } from "@components/drawer";
import { setSelectedTransaction } from "@redux/assets/AssetReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { useMemo } from "react";
import DrawerTransaction from "./Transaction";
import { SpecialTxTypeEnum, TransactionTypeEnum } from "@/const";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { getAddress } from "@/utils";

export default function TransactionInspectDrawer() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { transactionDrawer } = useAppSelector((state) => state.transaction);
  const { selectedTransaction } = useAppSelector((state) => state.asset);
  const { selectedAccount } = GeneralHook();

  const isDrawerOpen = useMemo(() => {
    return Boolean(selectedTransaction && TransactionDrawer.INSPECT === transactionDrawer);
  }, [selectedTransaction]);

  const isTo = getAddress(
    selectedTransaction?.type || TransactionTypeEnum.Enum.NONE,
    selectedTransaction?.from || "",
    selectedTransaction?.fromSub || "",
    selectedAccount?.address || "",
    selectedAccount?.sub_account_id || "",
  );

  if (!isDrawerOpen) return <></>;

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className="flex flex-row items-center justify-between w-full px-6 mt-4">
        <div className="flex flex-row items-center justify-start gap-7">
          <p className="text-lg font-semibold text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {selectedTransaction?.kind === SpecialTxTypeEnum.Enum.mint
              ? "Mint"
              : selectedTransaction?.kind === SpecialTxTypeEnum.Enum.burn
              ? "Burn"
              : selectedTransaction?.type === TransactionTypeEnum.Enum.RECEIVE
              ? t("transaction.received")
              : t("transaction.sent")}
          </p>
          <img
            src={
              selectedTransaction?.kind === SpecialTxTypeEnum.Enum.mint
                ? DownAmountIcon
                : selectedTransaction?.kind === SpecialTxTypeEnum.Enum.burn
                ? UpAmountIcon
                : isTo
                ? UpAmountIcon
                : DownAmountIcon
            }
            alt=""
          />
        </div>

        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setTransactionDrawerAction(TransactionDrawer.NONE);
            dispatch(setSelectedTransaction(undefined));
          }}
        />
      </div>

      <DrawerTransaction />
    </BasicDrawer>
  );
}
