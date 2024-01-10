import { TAllowance } from "@/@types/allowance";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { middleTruncation } from "@/utils/strings";
import { Chip } from "@components/chip";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface FixedFieldsProps {
  allowance: TAllowance;
}

export default function FixedFieldsFormItem({ allowance }: FixedFieldsProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full p-4 rounded-md bg-PrimaryColorLight dark:bg-ThemeColorBack">
      <p className="text-lg font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("subAccount")}</p>
      <div className="flex items-center mt-4">
        <div className="flex flex-col items-start justify-center mr-4">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, allowance.asset?.tokenSymbol, allowance.asset?.logo)}
          <p className="mt-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor">{allowance.asset?.tokenSymbol}</p>
        </div>

        <div className="flex items-center justify-start">
          <Chip size="medium" text={allowance.subAccount.sub_account_id || ""} className="mr-2" />
          <p className={textStyles}>{allowance.subAccount.name}</p>
        </div>
      </div>

      <div className="w-full mt-4 mb-4 border-b border-BorderColorThree" />

      <p className="text-lg font-bold">{t("spender")}</p>

      <div className="flex justify-between mt-4">
        <p className={textStyles}>{t("principal")}</p>
        <p className={textStyles}>{middleTruncation(allowance?.spender?.principal, 5, 5)}</p>
      </div>

      <div className="flex justify-between mt-4">
        <p className={textStyles}>{t("name")}</p>
        <p className={textStyles}>{allowance?.spender?.name ? allowance?.spender?.name : "-"}</p>
      </div>
    </div>
  );
}

const textStyles = clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor");
