import { ICRCSubaccountInfo, ICRCSubaccountInfoEnum } from "@/const";
import { useTranslation } from "react-i18next";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import AddAllowanceButton from "../allowance/AddAllowanceButton";
import { Tab } from "@components/tabs";
import clsx from "clsx";

interface ICRCSubInfoProps extends PropsWithChildren {
  subInfoType: ICRCSubaccountInfo;
  setSubInfoType: Dispatch<SetStateAction<ICRCSubaccountInfo>>;
}

export default function ICRCSubInfo({ subInfoType, setSubInfoType, children }: ICRCSubInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start justify-start w-full mt-2">
      <div className="flex flex-row items-center justify-between w-full mb-4">
        <Tab
          tabs={[
            {
              tabName: ICRCSubaccountInfoEnum.Enum.TRANSACTIONS,
              content: (
                <p className={getTabStyles(subInfoType === ICRCSubaccountInfoEnum.Enum.TRANSACTIONS)}>
                  {" "}
                  {t("transaction.transactions")}
                </p>
              ),
            },
            {
              tabName: ICRCSubaccountInfoEnum.Enum.ALLOWANCES,
              content: (
                <p className={getTabStyles(subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES)}>
                  {t("allowance.allowances")}
                </p>
              ),
            },
          ]}
          activeTab={subInfoType}
          onTabChange={(tab) => setSubInfoType(tab as ICRCSubaccountInfo)}
        />
        {subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES && <AddAllowanceButton />}
      </div>

      <div className="flex w-full">{children}</div>
    </div>
  );
}

function getTabStyles(isActive: boolean) {
  return clsx(
    "text-lg px-2 py-1 font-bold",
    isActive ? "text-primary-color" : "text-gray-color-6 dark:text-gray-color-3",
  );
}
