import { getAllowanceDetails } from "@common/libs/icrc";

interface RequestAccount {
  assetAddress: string;
  assetDecimal: string;
  allocatorPrincipal: string;
  allocatorSubaccount: string;
  spenderPrincipal: string;
}

interface Args {
  subaccounts: RequestAccount[];
}

export default async function addAllowanceToSubaccounts({ subaccounts }: Args) {
  return await Promise.all(
    subaccounts.map(async (subaccount) => {
      const response = await getAllowanceDetails(subaccount);
      return { ...subaccount, allowance: response };
    }),
  );
}
