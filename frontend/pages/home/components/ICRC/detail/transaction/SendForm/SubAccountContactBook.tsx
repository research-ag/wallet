import { AvatarEmpty } from "@components/avatar";
import { getIconSrc } from "@/utils/icons";
import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";

export default function SubAccountContactBook() {
  const { sender } = useAppSelector((state) => state.transaction);

  const subAccountName =
    sender?.subAccount?.name ||
    `${sender?.allowanceContactSubAccount?.contactName} [${sender?.allowanceContactSubAccount?.subAccountName}]`;

  const subAccountBalance = useMemo(() => {
    const SenderSubAccountId = sender?.subAccount?.sub_account_id
      ? sender?.subAccount.sub_account_id
      : sender?.allowanceContactSubAccount.subAccountId;

    const subAccountFromOwn = sender?.asset?.subAccounts?.find(
      (subAccount) => subAccount?.sub_account_id == SenderSubAccountId,
    );

    return subAccountFromOwn?.amount || sender?.allowanceContactSubAccount?.subAccountAllowance?.allowance;
  }, [sender]);

  return (
    <div className="flex justify-start w-full p-2 border rounded-md border-gray-color-2 bg-secondary-color-2">
      <div className="flex items-center justify-center">
        <AvatarEmpty title={subAccountName} className="mr-2" size="large" />
      </div>
      <div className="text-start">
        <p>{subAccountName}</p>
        <div className="flex">
          <img src={getIconSrc(sender?.asset?.logo, sender?.asset?.tokenSymbol)} className="w-4 h-4 mr-2" alt="" />
          <p className="opacity-50 text-md">
            {subAccountBalance} {sender?.asset?.tokenSymbol}
          </p>
        </div>
      </div>
    </div>
  );
}
