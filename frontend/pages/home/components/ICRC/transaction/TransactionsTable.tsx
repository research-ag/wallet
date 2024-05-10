import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
import DownAmountIcon from "@assets/svg/files/down-amount-icon.svg";
//
import { useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { SpecialTxTypeEnum, TransactionTypeEnum } from "@common/const";
import { getAddress, getAssetSymbol } from "@common/utils/icrc";
import CodeElement from "@components/TableCodeElement";
import moment from "moment";
import { toFullDecimal } from "@common/utils/amount";
import { Transaction } from "@redux/models/AccountModels";

const columns: string[] = ["type", "transactionID", "date", "amount"];

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

  return (
    <div className="w-full max-h-[calc(100vh-15rem)] scroll-y-light mt-2" onScroll={onScroll}>
      <table className="relative w-full text-black-color dark:text-gray-color-9 ">
        <thead className={headerStyles}>
          <tr>
            {columns.map((currentColumn, index) => (
              <th key={currentColumn} className={colStyle(index)}>
                <div className={`flex items-center px-1 py-2 ${justifyCell(index)}`}>
                  <p>{t(currentColumn)}</p>
                  {currentColumn === columns[columns.length - 2] && (
                    <SortIcon
                      className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                      onClick={onSort}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

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
              <tr key={`${transaction.hash}-${index}-${transaction.canisterId}`} className="relative">
                <td className={colStyle(0)}>
                  {isCurrentSelected && <div className="absolute w-2 h-[4.05rem] left-0 bg-primary-color"></div>}
                  <div className="flex justify-center w-full h-12 my-2">
                    <div className="flex items-center justify-center p-2 border rounded-md border-BorderColorTwoLight dark:border-BorderColorTwo">
                      <img src={srcType} alt={transaction.kind} />
                    </div>
                  </div>
                </td>

                <td className={colStyle(1)}>
                  <CodeElement tx={transaction} />
                </td>

                <td className={colStyle(3)}>
                  <div className="flex items-center justify-end">
                    <p className="text-md w-fit">{moment(transaction.timestamp).format("M/DD/YYYY")}</p>
                  </div>
                </td>

                <td className={colStyle(0)}>
                  <div className="flex flex-col items-end justify-center w-full pr-5 my-2">
                    <p
                      className={`text-right whitespace-nowrap ${
                        isTo ? "text-TextSendColor" : "text-TextReceiveColor"
                      }`}
                    >{`${isTo && !isApprove ? "-" : ""}${
                      isTypeSend
                        ? toFullDecimal(
                            BigInt(transaction?.amount || "0") + BigInt(selectedAccount?.transaction_fee || "0"),
                            selectedAccount?.decimal || 8,
                          )
                        : toFullDecimal(BigInt(transaction?.amount || "0"), selectedAccount?.decimal || 8)
                    } ${getAssetSymbol(transaction?.symbol || selectedAsset?.symbol || "", assets)}`}</p>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Tailwind CSS
const colStyle = (idxTH: number) =>
  clsx({
    ["realtive"]: true,
    ["w-[5rem] min-w-[5rem] max-w-[5rem]"]: idxTH === 0,
    ["w-[calc(55%-5rem)] min-w-[calc(55%-5rem)] max-w-[calc(55%-5rem)]"]: idxTH === 1,
    ["w-[20%] min-w-[20%] max-w-[20%]"]: idxTH === 2,
    ["w-[25%] min-w-[25%] max-w-[25%]"]: idxTH === 3,
  });

function justifyCell(index: number) {
  switch (index) {
    case 0:
      return "justify-start";
    case 1:
      return "justify-start";
    case 2:
      return "justify-end";
    case 3:
      return "justify-end";
    default:
      return "";
  }
}

const headerStyles = clsx(
  "sticky top-0 z-10",
  "border-b dark:border-gray-color-1",
  "text-left text-md text-black-color dark:text-gray-color-6 bg-white dark:bg-SecondaryColor",
  "divide-y dark:divide-gray-color-1 divide-gray-color-6",
);

const bodyStyles = clsx(
  "text-md text-left text-black-color dark:text-gray-color-6",
  "divide-y dark:divide-gray-color-1 divide-gray-color-6",
);
