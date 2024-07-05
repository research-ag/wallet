import { Contact } from "@redux/models/ContactsModels";

export const filterContactsByAllowances = (contacts: Contact[]) => {
  return contacts.filter((contact) => contact.accounts.some((account) => account.allowance?.amount));
};

export const filterContactAccountByAllowances = (contact: Contact) => {
  return {
    ...contact,
    accounts: contact.accounts.filter((account) => account.allowance?.amount),
  };
};

export const filterContactsByAssets = (contacts: Contact[], assets: string[]) => {
  return contacts.filter((contact) => {
    return contact.accounts.some((account) => assets.includes(account.tokenSymbol));
  });
};

export const filterContactAccountsByAssets = (contact: Contact, assets: string[]) => {
  return {
    ...contact,
    accounts: contact.accounts.filter((account) => assets.includes(account.tokenSymbol)),
  };
}

export const filterContactsBySearchKey = (contacts: Contact[], searchKey: string) => {
  const contactAcountFiltered = contacts.map((contact) => {
    return {
      ...contact,
      accounts: contact.accounts.filter((account) => {
        const searchValue = searchKey.toLowerCase().trim();

        const accountNameMatch = account.name.toLowerCase().includes(searchValue);
        const accountIdMatch = account.subaccountId.toLowerCase().includes(searchValue);

        return accountNameMatch || accountIdMatch;
      }),
    };
  });


  return contactAcountFiltered.filter((contact) => {

    const contactNameMatch = contact.name.toLowerCase().includes(searchKey);
    const contactPrincipalMatch = contact.principal.toLowerCase().includes(searchKey);

    return contact.accounts.length > 0 || contactNameMatch || contactPrincipalMatch;
  });
};
