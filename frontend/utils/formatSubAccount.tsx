import { SubAccount } from "@redux/models/AccountModels";
import { Chip } from "@components/chip";

export default function formatSubAccount(subAccount: SubAccount) {
  return {
    value: subAccount?.sub_account_id,
    label: subAccount?.name,
    icon: <Chip text={subAccount.sub_account_id} size="medium" className="mr-4" />,
  };
}
