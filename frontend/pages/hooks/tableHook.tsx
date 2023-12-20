import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
import DownAmountIcon from "@assets/svg/files/down-amount-icon.svg";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "@redux/models/AccountModels";
import moment from "moment";
import { getAddress, getAssetSymbol, toFullDecimal } from "@/utils";
import { useTranslation } from "react-i18next";
import { TransactionTypeEnum } from "@/const";
import { Fragment, useState } from "react";
import { useAppSelector } from "@redux/Store";
import CodeElement from "@components/TableCodeElement";
import { AssetHook } from "@pages/home/hooks/assetHook";

export const TableHook = () => {
  const { t } = useTranslation();
  const { assets } = AssetHook();

  const [sorting, setSorting] = useState<SortingState>([]);
  const { selectedAccount, selectedTransaction } = useAppSelector((state) => state.asset);
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
          <div className="flex w-full justify-center my-2 h-12">
            <div className="flex justify-center items-center p-2 rounded-md border border-BorderColorTwoLight dark:border-BorderColorTwo">
              <img
                src={
                  info.getValue().kind === "burn"
                    ? UpAmountIcon
                    : info.getValue().kind === "mint"
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
      header: () => <p className="flex w-full justify-center opacity-60 font-normal my-2">{t("type")}</p>,
    }),
    columnHelper.accessor((row) => row, {
      id: "idx",
      cell: (info) => {
        return <CodeElement tx={info.getValue()} />;
      },
      header: () => <p className="flex w-full justify-start opacity-60 font-normal my-2">{t("transactionID")}</p>,
    }),
    columnHelper.accessor((row) => row.timestamp, {
      id: "timestamp",
      cell: (info) => (
        <div className="flex flex-col justify-center items-center my-2 w-full">
          <p>{moment(info.getValue()).format("M/DD/YYYY")}</p>
        </div>
      ),
      header: () => (
        <div className="flex flex-row opacity-60 justify-center items-center w-full gap-1 cursor-pointer">
          <p className="flex justify-center font-normal my-2">{t("date")}</p>
          <SortIcon className=" fill-PrimaryTextColorLight dark:fill-PrimaryTextColor w-3 h-3" />
        </div>
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: "amount",
      cell: (info) => {
        let isTo =
          info.getValue().kind !== "mint" &&
          getAddress(
            info.getValue().type,
            info.getValue().from || "",
            info.getValue().fromSub || "",
            selectedAccount?.address || "",
            selectedAccount?.sub_account_id || "",
          );

        return (
          <div className="flex flex-col justify-center items-end my-2 w-full pr-5">
            <p className={`text-right whitespace-nowrap ${isTo ? "text-TextSendColor" : "text-TextReceiveColor"}`}>{`${
              isTo ? "-" : ""
            }${
              info.getValue()?.type === TransactionTypeEnum.Enum.SEND
                ? toFullDecimal(
                    BigInt(info.getValue()?.amount) + BigInt(selectedAccount?.transaction_fee || "0"),
                    selectedAccount?.decimal || 8,
                  )
                : toFullDecimal(BigInt(info.getValue()?.amount), selectedAccount?.decimal || 8)
            } ${getAssetSymbol(info.getValue()?.symbol || "", assets)}`}</p>
          </div>
        );
      },
      header: () => <p className="flex w-full justify-end opacity-60 font-normal my-2 pr-5">{t("amount")}</p>,
    }),
  ];

  return { columns, sorting, setSorting };
};
