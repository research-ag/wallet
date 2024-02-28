import { retrieveAssetsWithAllowance } from "@/pages/home/helpers/icrc/";
import { db } from "@/database/db";

export default async function contactCacheRefresh() {
  try {
    const contacts = await db().getContacts();

    const updatedContacts = [];
    if (contacts) {
      for (const contact of contacts) {
        const updatedAsset = await retrieveAssetsWithAllowance({
          accountPrincipal: contact.principal,
          assets: contact.assets,
        });

        updatedContacts.push({ ...contact, assets: updatedAsset });
      }
    }

    await db().updateContacts(updatedContacts);
  } catch (error) {
    console.error(error);
  }
}
