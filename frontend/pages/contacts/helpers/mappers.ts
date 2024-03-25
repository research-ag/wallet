import { Contact } from "@redux/models/ContactsModels";

export function getStateContact(contact: Contact) {
  return {
    ...contact,
    assets: contact.assets.map((asset) => ({
      ...asset,
      subaccounts: asset.subaccounts.map((subaccount) => {
        const { allowance, ...rest } = subaccount;
        console.info("removed from contact: ", allowance);
        return { ...rest };
      }),
    }))
  };
};
