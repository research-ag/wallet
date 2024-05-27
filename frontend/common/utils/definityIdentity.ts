import { Principal } from "@dfinity/principal";

export function validatePrincipal(principal: string): boolean {
  try {
    Principal.fromText(principal.trim());
    return true;
  } catch {
    return false;
  }
}
