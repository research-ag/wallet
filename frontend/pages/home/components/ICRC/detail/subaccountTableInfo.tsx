import { ICRCSubaccountInfo, ICRCSubaccountInfoEnum } from "@/const";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import { PropsWithChildren, useMemo } from "react";
import AddAllowanceButton from "../allowance/AddAllowanceButton";
import { useAppSelector } from "@redux/Store";
import useAllowances from "@pages/home/hooks/useAllowances";

interface ICRCSubInfoProps extends PropsWithChildren {
  subInfoType: ICRCSubaccountInfo;
  setSubInfoType(value: ICRCSubaccountInfo): void;
}

export default function ICRCSubInfo({ subInfoType, setSubInfoType, children }: ICRCSubInfoProps) {
  const { t } = useTranslation();

  const { transactions } = useAppSelector((state) => state.asset);
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { allowances } = useAllowances();
  const transactionsCount = useMemo(() => transactions.length, [transactions]);
  const allowancesCount = useMemo(() => allowances.length, [allowances]);

  const selectedButton = "border-AccpetButtonColor border-b-2";
  const unselectedButton = "text-PrimaryTextColorLight dark:text-PrimaryTextColor opacity-60 !font-light";
  return (
    <div className="flex flex-col items-start justify-start w-full mt-2">
      <div className="flex flex-row items-center justify-between w-full mb-4">
        <div className="flex flex-row items-center justify-start gap-10 mb-4">
          <CustomButton
            intent={"noBG"}
            border={"underline"}
            className={`${
              subInfoType === ICRCSubaccountInfoEnum.Enum.TRANSACTIONS ? selectedButton : unselectedButton
            }`}
            onClick={() => {
              setSubInfoType(ICRCSubaccountInfoEnum.Enum.TRANSACTIONS);
            }}
          >
            <p>
              {t("transaction.transactions")} ({transactionsCount || 0})
            </p>
          </CustomButton>
          <CustomButton
            intent={"noBG"}
            border={"underline"}
            className={`${subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES ? selectedButton : unselectedButton}`}
            onClick={() => {
              setSubInfoType(ICRCSubaccountInfoEnum.Enum.ALLOWANCES);
            }}
          >
            <p>
              {t("allowance.allowances")} ({allowancesCount || 0})
            </p>
          </CustomButton>
        </div>
        {!watchOnlyMode && subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES && <AddAllowanceButton />}
      </div>

      <div className="flex w-full">{children}</div>
    </div>
  );
}
