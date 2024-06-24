import { ContactAccount } from "@redux/models/ContactsModels";
import { isContactSubaccountIdValid } from "./validators";
import { RequestAccountAllowance } from "./addAllowanceToSubaccounts";
import store from "@redux/Store";

interface ContactAccountToAllowanceArgs {
  contactAccounts: ContactAccount[];
  allocatorPrincipal: string;
  spenderPrincipal: string;
}

export default function contactAccountToAllowanceArgs(args: ContactAccountToAllowanceArgs) {
  const { contactAccounts, allocatorPrincipal, spenderPrincipal } = args;
  const assets = store.getState().asset.list.assets;

  return contactAccounts
    .map((account) => {
      const currentAsset = assets.find((asset) => asset.tokenSymbol === account?.tokenSymbol);
      if (isContactSubaccountIdValid(account.subaccountId) && currentAsset) {
        return {
          assetAddress: currentAsset?.address,
          assetDecimal: currentAsset?.decimal,
          spenderPrincipal,
          allocatorSubaccount: account?.subaccountId,
          allocatorPrincipal,
          account,
        };
      }
      return null;
    })
    .filter(Boolean) as RequestAccountAllowance[];
}
