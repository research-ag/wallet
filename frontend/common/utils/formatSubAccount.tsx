import { SubAccount } from "@redux/models/AccountModels";
import { middleTruncation } from "@/common/utils/strings";
import { AvatarEmpty } from "@components/avatar";

export default function formatSubAccount(subAccount: SubAccount) {
  return {
    value: subAccount?.sub_account_id,
    label: subAccount?.name.length > 20 ? middleTruncation(subAccount?.name, 10, 10) : subAccount?.name,
    icon: <AvatarEmpty title={subAccount?.name} size="medium" className="mr-4" />,
  };
}
