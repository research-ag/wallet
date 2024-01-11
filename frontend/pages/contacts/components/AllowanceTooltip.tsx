import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg"; 
import { ToolTip } from "@components/tooltip";
export default function AllowanceTooltip() {
  return (
    <div className="grid m-10 place-items-center">
      <ToolTip trigger={<MoneyHandIcon className="relative w-5 h-5 cursor-pointer fill-RadioCheckColor" />}>
        <div className="h-24 w-fit">
          <h2 className="text-lg opacity-50 dark:text-PrimaryTextColor text-PrimaryTextColorLight">Amount</h2>
          <h2 className="text-lg dark:text-PrimaryTextColor text-PrimaryTextColorLight">1000000000 BTC</h2>
          <h2 className="text-lg opacity-50 dark:text-PrimaryTextColor text-PrimaryTextColorLight">Expiration</h2>
          <h2 className="text-lg dark:text-PrimaryTextColor text-PrimaryTextColorLight">12/2/2023 02:37</h2>
        </div>
      </ToolTip>
    </div>
  );
}
