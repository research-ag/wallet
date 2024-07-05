import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
import DownAmountIcon from "@assets/svg/files/down-amount-icon.svg";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "@redux/models/AccountModels";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { SpecialTxTypeEnum, TransactionTypeEnum } from "@/common/const";
import { Fragment, useState } from "react";
import { useAppSelector } from "@redux/Store";
import CodeElement from "@components/TableCodeElement";
import { getAddress, getAssetSymbol } from "@common/utils/icrc";
import { toFullDecimal } from "@common/utils/amount";

export const useTransactionsTable = () => {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);

  const [sorting, setSorting] = useState<SortingState>([]);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { selectedTransaction } = useAppSelector((state) => state.transaction);

  const columnHelper = createColumnHelper<Transaction>();
  const columns = [
    columnHelper.accessor((row) => row, {
      id: "type",
      cell: (info) => (
        <Fragment>
          {((selectedTransaction?.hash && selectedTransaction?.hash === info.getValue().hash) ||
            (selectedTransaction?.idx && selectedTransaction?.idx === info.getValue().idx)) && (
            <div className="absolute w-2 h-[4.05rem] left-0 bg-SelectRowColor"></div>
          )}
          <div className="flex justify-center w-full h-12 my-2">
            <div className="flex items-center justify-center p-2 border rounded-md border-BorderColorTwoLight dark:border-BorderColorTwo">
              <img
                src={
                  info.getValue().kind === SpecialTxTypeEnum.Enum.burn
                    ? UpAmountIcon
                    : info.getValue().kind === SpecialTxTypeEnum.Enum.mint
                    ? DownAmountIcon
                    : getAddress(
                        info.getValue().type,
                        info.getValue().from || "",
                        info.getValue().fromSub || "",
                        selectedAccount?.address || "",
                        selectedAccount?.sub_account_id || "",
                      )
                    ? UpAmountIcon
                    : DownAmountIcon
                }
                alt=""
              />
            </div>
          </div>
        </Fragment>
      ),
      header: () => <p className="flex justify-center w-full my-2 font-normal opacity-60">{t("type")}</p>,
    }),
    columnHelper.accessor((row) => row, {
      id: "idx",
      cell: (info) => {
        return <CodeElement tx={info.getValue()} />;
      },
      header: () => <p className="flex justify-start w-full my-2 font-normal opacity-60">{t("transactionID")}</p>,
    }),
    columnHelper.accessor((row) => row.timestamp, {
      id: "timestamp",
      cell: (info) => (
        <div className="flex flex-col items-center justify-center w-full my-2">
          <p>{moment(info.getValue()).format("M/DD/YYYY")}</p>
        </div>
      ),
      header: () => (
        <div className="flex flex-row items-center justify-center w-full gap-1 cursor-pointer opacity-60">
          <p className="flex justify-center my-2 font-normal">{t("date")}</p>
          <SortIcon className="w-3 h-3 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
        </div>
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: "amount",
      cell: (info) => {
        const isTo =
          info.getValue().kind !== SpecialTxTypeEnum.Enum.mint &&
          getAddress(
            info.getValue().type,
            info.getValue().from || "",
            info.getValue().fromSub || "",
            selectedAccount?.address || "",
            selectedAccount?.sub_account_id || "",
          );

        const isApprove = info.getValue().kind?.toUpperCase() === TransactionTypeEnum.Enum.APPROVE;
        const isTypeSend = info.getValue()?.type === TransactionTypeEnum.Enum.SEND;

        return (
          <div className="flex flex-col items-end justify-center w-full pr-5 my-2">
            <p className={`text-right whitespace-nowrap ${isTo ? "text-TextSendColor" : "text-TextReceiveColor"}`}>{`${
              isTo && !isApprove ? "-" : ""
            }${
              isTypeSend
                ? toFullDecimal(
                    BigInt(info.getValue()?.amount || "0") + BigInt(selectedAccount?.transaction_fee || "0"),
                    selectedAccount?.decimal || 8,
                  )
                : toFullDecimal(BigInt(info.getValue()?.amount || "0"), selectedAccount?.decimal || 8)
            } ${getAssetSymbol(info.getValue()?.symbol || selectedAsset?.symbol || "", assets)}`}</p>
          </div>
        );
      },
      header: () => <p className="flex justify-end w-full pr-5 my-2 font-normal opacity-60">{t("amount")}</p>,
    }),
  ];

  return { columns, sorting, setSorting };
};
