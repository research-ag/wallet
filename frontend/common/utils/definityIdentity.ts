import { Principal } from "@dfinity/principal";
import logger from "@/common/utils/logger";

export function validatePrincipal(principal: string): boolean {
  try {
    Principal.fromText(principal.trim());
    return true;
  } catch (e) {
    logger.debug("Error parsing principal", e);
    return false;
  }
}
