import { ContactAccount } from "@redux/models/ContactsModels";
import { getAllowanceDetails } from "@common/libs/icrc";

export interface RequestAccountAllowance {
  assetAddress: string;
  assetDecimal: string;
  allocatorPrincipal: string;
  allocatorSubaccount: string;
  spenderPrincipal: string;
  account: ContactAccount;
}

export default async function addAllowanceToSubaccounts(subaccounts: RequestAccountAllowance[]) {
  return Promise.all(
    subaccounts.map(async (subaccount) => {
      const response = await getAllowanceDetails(subaccount);
      return {
        ...subaccount.account,
        allowance: response,
      };
    }),
  );
}
