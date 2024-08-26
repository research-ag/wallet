import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
import DownAmountIcon from "@assets/svg/files/down-amount-icon.svg";
//
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { SpecialTxTypeEnum, TransactionTypeEnum } from "@common/const";
import { getAddress, getAssetSymbol } from "@common/utils/icrc";
import CodeElement from "@components/TableCodeElement";
import moment from "moment";
import { toFullDecimal } from "@common/utils/amount";
import { Transaction } from "@redux/models/AccountModels";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { TransactionDrawer } from "@/@types/transactions";
import { setSelectedTransaction } from "@redux/transaction/TransactionReducer";
import { LoadingLoader } from "@components/loader";
export interface TransactionsTableProps {
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  transactions: Transaction[];
  onSort: () => void;
}

export default function TransactionsTable(props: TransactionsTableProps) {
  const { onScroll, transactions, onSort } = props;
  const { t } = useTranslation();
  const { selectedTransaction } = useAppSelector((state) => state.transaction);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full max-h-[calc(100vh-15rem)] scroll-y-light mt-2" onScroll={onScroll}>
      <table className="relative w-full text-black-color dark:text-gray-color-9 ">
        <thead className={headerStyles}>
          <tr>
            <th className="w-[8%]">
              <div className="flex items-center px-1 py-2">
                <p>{t("type")}</p>
              </div>
            </th>
            <th className="w-[60%]">
              <div className="flex items-center px-1 py-2">
                <p>{t("transactionID")}</p>
              </div>
            </th>
            <th className="w-[11%]">
              <div className="flex items-center px-1 py-2">
                <p>{t("date")}</p>
                <SortIcon
                  className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                  onClick={onSort}
                />
              </div>
            </th>
            <th className="w-[20%]">
              <div className="flex items-center justify-end px-1 py-2">
                <p>{t("amount")}</p>
              </div>
            </th>
          </tr>
        </thead>

        {transactions.length === 0 && isAppDataFreshing && (
          <tbody>
            <tr>
              <td colSpan={4} className="pt-[2rem]">
                <LoadingLoader />
              </td>
            </tr>
          </tbody>
        )}

        {transactions.length > 0 && (
          <tbody className={bodyStyles}>
            {transactions.map((transaction, index) => {
              // TYPE
              const isSelectedByHash = selectedTransaction?.hash && selectedTransaction?.hash === transaction.hash;
              const isSelectedByIdx = selectedTransaction?.idx && selectedTransaction?.idx === transaction.idx;
              const isCurrentSelected = isSelectedByHash || isSelectedByIdx;

              const isBurn = transaction.kind === SpecialTxTypeEnum.Enum.burn;
              const isMint = transaction.kind === SpecialTxTypeEnum.Enum.mint;
              const isSend = getAddress(
                transaction.type,
                transaction.from || "",
                transaction.fromSub || "",
                selectedAccount?.address || "",
                selectedAccount?.sub_account_id || "",
              );

              let srcType;

              switch (true) {
                case isBurn:
                  srcType = UpAmountIcon;
                  break;
                case isMint:
                  srcType = DownAmountIcon;
                  break;
                case isSend:
                  srcType = UpAmountIcon;
                  break;
                default:
                  srcType = DownAmountIcon;
              }

              // AMOUNT
              const isTo = transaction.kind !== SpecialTxTypeEnum.Enum.mint && isSend;
              const isApprove = transaction.kind?.toUpperCase() === TransactionTypeEnum.Enum.APPROVE;
              const isTypeSend = transaction?.type === TransactionTypeEnum.Enum.SEND;

              return (
                <tr
                  key={`${transaction.hash}-${index}-${transaction.canisterId}`}
                  className="relative cursor-pointer"
                  onClick={() => onTransactionInpect(transaction)}
                >
                  <td className="w-[8%]">
                    <div className="flex h-full ">
                      <div className="flex items-center justify-center border rounded-md border-BorderColorTwoLight dark:border-BorderColorTwo w-[2rem] h-[2rem]">
                        <img src={srcType} alt={transaction.kind} />
                      </div>
                    </div>
                    {isCurrentSelected && <div className="absolute w-1 h-[4.1rem] left-0 top-0 bg-primary-color"></div>}
                  </td>

                  <td className="w-[60%]">
                    <CodeElement tx={transaction} />
                  </td>

                  <td className="w-[11%]">
                    <div className="flex items-center">
                      <p className="text-md w-fit">{moment(transaction.timestamp).format("M/DD/YYYY hh:mm")}</p>
                    </div>
                  </td>

                  <td className="w-[20%]">
                    <div className="flex justify-end">
                      <p className={amountTextStyles(isTo)}>
                        {isTo && !isApprove ? "-" : ""}
                        {isTypeSend
                          ? toFullDecimal(
                              BigInt(transaction?.amount || "0") + BigInt(selectedAccount?.transaction_fee || "0"),
                              selectedAccount?.decimal || 8,
                            )
                          : toFullDecimal(BigInt(transaction?.amount || "0"), selectedAccount?.decimal || 8)}{" "}
                        {getAssetSymbol(transaction?.symbol || selectedAsset?.symbol || "", assets)}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );

  function onTransactionInpect(transaction: Transaction) {
    dispatch(setSelectedTransaction(transaction));
    setTransactionDrawerAction(TransactionDrawer.INSPECT);
  }
}

// Tailwind CSS

const headerStyles = clsx(
  "sticky top-0 z-10",
  "border-b dark:border-gray-color-1 border-gray-color-6",
  "text-left text-md text-black-color dark:text-gray-color-6 bg-secondary-color-1-light dark:bg-SecondaryColor",
  "divide-y dark:divide-gray-color-1 divide-gray-color-6",
);

const bodyStyles = clsx(
  "text-md text-left text-black-color dark:text-gray-color-6",
  "divide-y dark:divide-gray-color-1 divide-gray-color-6",
);

const amountTextStyles = (isTo: boolean) =>
  clsx("text-right whitespace-nowrap", isTo ? "text-TextSendColor" : "text-TextReceiveColor");
