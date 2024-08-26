import { Asset, SubAccount } from "@redux/models/AccountModels";
import { middleTruncation } from "@/common/utils/strings";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { toFullDecimal } from "./amount";

export default function formatSubAccount(subAccount: SubAccount, asset?: Asset): SelectOption {
  return {
    value: subAccount?.sub_account_id,
    label: subAccount?.name.length > 20 ? middleTruncation(subAccount?.name, 10, 10) : subAccount?.name,
    subLabel: asset ? `${toFullDecimal(subAccount.amount, Number(asset.decimal))} ${asset.symbol}` : undefined,
    icon: <AvatarEmpty title={subAccount?.name} size="medium" className="mr-4" />,
  };
}
