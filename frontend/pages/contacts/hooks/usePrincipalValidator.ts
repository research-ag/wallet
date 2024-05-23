import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import { useAppSelector } from "@redux/Store";
import logger from "@/common/utils/logger";

export default function usePrincipalValidator() {
  const { contacts } = useAppSelector((state) => state.contacts);

  const checkPrincipalValid = (principal: string) => {
    if (principal.trim() === "") return false;
    try {
      decodeIcrcAccount(principal);
    } catch (error) {
      logger.debug("Error parsing principal", error);
      return false;
    }
    return contacts.find((ctc) => ctc.principal === principal) ? false : true;
  };

  return {
    contacts,
    checkPrincipalValid,
  };
}
