import logger from "@/common/utils/logger";

export default async function contactCacheRefresh() {
  try {
    // const contacts = await db().getContacts();
    // if (contacts) {
    //   const promises = contacts.map(async (contact) => {
    //     const updatedAsset = await retrieveSubAccountsWithAllowance({
    //       accountPrincipal: contact.principal,
    //     });
    //     return { ...contact, assets: updatedAsset };
    //   });
    //   const updatedContacts = await Promise.all(promises);
    //   store.dispatch(setReduxContacts(updatedContacts));
    // }
  } catch (error) {
    logger.debug(error);
  }
}
