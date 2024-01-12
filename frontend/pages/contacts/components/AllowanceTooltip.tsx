import { formatDateTime } from "@/utils/formatTime";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ToolTip } from "@components/tooltip";
interface AllowanceTooltipProps {
  amount: number | string;
  expiration: string;
  tokenSymbol?: string;
}

export default function AllowanceTooltip(props: AllowanceTooltipProps) {
  const { amount, expiration, tokenSymbol } = props;

  return (
    <div className="grid mr-2 place-items-center">
      <ToolTip trigger={<MoneyHandIcon className="relative w-5 h-5 cursor-pointer fill-RadioCheckColor" />}>
        <div className="h-24 w-fit">
          <h2 className="text-lg opacity-50 dark:text-PrimaryTextColor text-PrimaryTextColorLight">Amount</h2>
          <h2 className="text-lg dark:text-PrimaryTextColor text-PrimaryTextColorLight">
            {amount} {tokenSymbol}
          </h2>
          <h2 className="text-lg opacity-50 dark:text-PrimaryTextColor text-PrimaryTextColorLight">Expiration</h2>
          <h2 className="text-lg dark:text-PrimaryTextColor text-PrimaryTextColorLight">
            {formatDateTime(expiration)}
          </h2>
        </div>
      </ToolTip>
    </div>
  );
}
