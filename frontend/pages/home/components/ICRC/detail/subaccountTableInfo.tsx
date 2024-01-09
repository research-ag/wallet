import { ICRCSubaccountInfo, ICRCSubaccountInfoEnum } from "@/const";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import { PropsWithChildren } from "react";

interface ICRCSubInfoProps extends PropsWithChildren {
  subInfoType: ICRCSubaccountInfo;
  setSubInfoType(value: ICRCSubaccountInfo): void;
}

const ICRCSubInfo = ({ subInfoType, setSubInfoType, children }: ICRCSubInfoProps) => {
  const { t } = useTranslation();

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
            <p>{t("transactions")}</p>
          </CustomButton>
          <CustomButton
            intent={"noBG"}
            border={"underline"}
            className={`${subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES ? selectedButton : unselectedButton}`}
            onClick={() => {
              setSubInfoType(ICRCSubaccountInfoEnum.Enum.ALLOWANCES);
            }}
          >
            <p>{t("allowance")}</p>
          </CustomButton>
        </div>
      </div>

      <div className="flex w-full">{children}</div>
    </div>
  );
};

export default ICRCSubInfo;
