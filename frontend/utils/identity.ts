import { Principal } from "@dfinity/principal";

export function validatePrincipal(principal: string): boolean {
  try {
    Principal.fromText(principal);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
