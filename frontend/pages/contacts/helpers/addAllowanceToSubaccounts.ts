import { ContactAccount } from "@/@types/contacts";
import { getAllowanceDetails } from "@common/libs/icrc";

export interface RequestAccountAllowance {
  assetAddress: string;
  assetDecimal: string;
  allocatorPrincipal: string;
  allocatorSubaccount: string;
  spenderPrincipal: string;
  account: ContactAccount;
}

interface AddAllowanceToSubaccountsArgs { subaccounts: RequestAccountAllowance[]; }

export default async function addAllowanceToSubaccounts({ subaccounts }: AddAllowanceToSubaccountsArgs) {
  return Promise.all(
    subaccounts.map(async (subaccount) => {
      const response = await getAllowanceDetails(subaccount);
      return {
        ...subaccount.account,
        allowance: response
      };
    }),
  );
}
