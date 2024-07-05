import { formatDateTime } from "@/common/utils/datetimeFormaters";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { BasicToolTip } from "@components/tooltip";
import { useTranslation } from "react-i18next";

interface AllowanceTooltipProps {
  amount: number | string;
  expiration: string;
  tokenSymbol: string;
}

export default function AllowanceTooltip(props: AllowanceTooltipProps) {
  const { t } = useTranslation();
  const { amount, expiration, tokenSymbol } = props;

  return (
    <div className="grid mr-2 place-items-center">
      <BasicToolTip
        trigger={
          <MoneyHandIcon className="relative w-6 h-6 ml-1 cursor-pointer fill-primary-color" />
        }
      >
        <div className="h-[7rem] w-[9rem]">
          <h2 className="text-lg dark:text-PrimaryTextColor/50 text-PrimaryTextColorLight/50">{t("amount")}</h2>
          <h2 className="text-lg dark:text-PrimaryTextColor text-PrimaryTextColorLight">
            {amount} {tokenSymbol}
          </h2>
          <h2 className="text-lg dark:text-PrimaryTextColor/50 text-PrimaryTextColorLight/50">{t("expiration")}</h2>
          <h2 className="text-lg dark:text-PrimaryTextColor text-PrimaryTextColorLight">
            {expiration ? formatDateTime(expiration) : t("no.expiration")}
          </h2>
        </div>
      </BasicToolTip>
    </div>
  );
}
