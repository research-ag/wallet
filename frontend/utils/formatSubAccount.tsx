import { SubAccount } from "@redux/models/AccountModels";
import { BasicChip } from "@components/chip";
import { middleTruncation } from "./strings";

export default function formatSubAccount(subAccount: SubAccount) {
  return {
    value: subAccount?.sub_account_id,
    label: subAccount?.name.length > 20 ? middleTruncation(subAccount?.name, 10, 10) : subAccount?.name,
    icon: (
      <BasicChip
        text={subAccount.sub_account_id.length > 6 ? middleTruncation(subAccount?.name, 2, 2) : subAccount.sub_account_id}
        size="medium"
        className="mr-4"
      />
    ),
  };
}
