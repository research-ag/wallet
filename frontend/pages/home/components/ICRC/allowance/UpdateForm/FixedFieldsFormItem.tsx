import { TAllowance } from "@/@types/allowance";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { middleTruncation } from "@/utils/strings";
import { Chip } from "@components/chip";
import { useAppSelector } from "@redux/Store";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface FixedFieldsProps {
  allowance: TAllowance;
}

export default function FixedFieldsFormItem({ allowance }: FixedFieldsProps) {
  const { t } = useTranslation();
  const { contacts } = useAppSelector((state) => state.contacts);

  const spenderName = useMemo(() => {
    const contact = contacts.find((contact) => contact.principal === allowance?.spender);
    return contact?.name ? contact.name : "-";
  }, [allowance, contacts]);

  return (
    <div className="w-full p-4 rounded-md bg-secondary-color-1-light dark:bg-ThemeColorBack">
      <p className="text-lg font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("subAccount")}</p>
      <div className="flex items-center mt-4">
        <div className="flex flex-col items-start justify-center mr-4">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, allowance.asset?.tokenSymbol, allowance.asset?.logo)}
          <p className="mt-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor">{allowance.asset?.tokenSymbol}</p>
        </div>

        <div className="flex items-center justify-start">
          <Chip size="medium" text={allowance.subAccountId || ""} className="mr-2" />
          {/* Get the allowance sub account name here */}
          <p className={textStyles}>{}</p>
        </div>
      </div>

      <div className="w-full mt-4 mb-4 border-b border-BorderColorThree" />

      <p className="text-lg font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("spender")}</p>

      <div className="flex justify-between mt-4">
        <p className={textStyles}>{t("principal")}</p>
        <p className={textStyles}>{middleTruncation(allowance?.spender, 5, 5)}</p>
      </div>

      <div className="flex justify-between mt-4">
        <p className={textStyles}>{t("name")}</p>
        <p className={textStyles}>{spenderName}</p>
      </div>
    </div>
  );
}

const textStyles = clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor");
