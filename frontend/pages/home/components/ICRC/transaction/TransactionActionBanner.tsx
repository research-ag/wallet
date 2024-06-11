// svgs
import ArrowBottomLeftIcon from "@assets/svg/files/arrow-bottom-left-icon.svg";
import ArrowTopRightIcon from "@assets/svg/files/arrow-top-right-icon.svg";
//
import { IconTypeEnum } from "@/common/const";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { TransactionDrawer } from "@/@types/transactions";
import { getAssetIcon } from "@/common/utils/icons";
import { toFullDecimal } from "@common/utils/amount";

export default function ICRCSubaccountAction() {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  return (
    <div className="flex flex-row justify-between items-center w-full h-[4.75rem] bg-TransactionHeaderColorLight dark:bg-TransactionHeaderColor rounded-md">
      <div className="flex flex-col justify-center items-start bg-SelectRowColor w-[17rem] h-full rounded-l-md p-4 text-[#ffff]">
        <div className="flex flex-row items-center justify-between w-full gap-1">
          {getAssetIcon(IconTypeEnum.Enum.HEADER, selectedAsset?.tokenSymbol, selectedAsset?.logo)}
          <div className="flex flex-col items-end justify-center">
            <p className="font-semibold text-[1.15rem] text-right">{`${toFullDecimal(
              selectedAccount?.amount || "0",
              selectedAccount?.decimal || 8,
              Number(selectedAsset?.shortDecimal),
            )} ${selectedAsset?.symbol || ""}`}</p>
            <p className="font-semibold text-md">{`$${selectedAccount?.currency_amount || ""}`}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-around items-center h-full w-[calc(100%-17rem)] text-ThirdTextColorLight dark:text-ThirdTextColor">
        <div
          className={clsx(
            "flex flex-col justify-center items-center w-1/3 gap-1",
            watchOnlyMode && "pointer-events-none",
          )}
        >
          <div
            className={clsx(
              "flex flex-row justify-center items-center w-7 h-7 rounded-md cursor-pointer",
              (watchOnlyMode && "bg-GrayColor") || "bg-SelectRowColor",
            )}
            onClick={() => {
              setTransactionDrawerAction(TransactionDrawer.SEND);
            }}
          >
            <img src={ArrowTopRightIcon} className="w-3 h-3" alt="send-icon" />
          </div>
          <p className="text-md">{t("transfer")}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-1/3 gap-1">
          <div
            className="flex flex-row items-center justify-center rounded-md cursor-pointer w-7 h-7 bg-SelectRowColor"
            onClick={() => {
              setTransactionDrawerAction(TransactionDrawer.RECEIVE);
            }}
          >
            <img src={ArrowBottomLeftIcon} className="w-3 h-3" alt="receive-icon" />
          </div>
          <p className="text-md">{t("deposit")}</p>
        </div>
      </div>
    </div>
  );
}
