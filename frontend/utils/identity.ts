import { Principal } from "@dfinity/principal";
import store from "@redux/Store";

export function validatePrincipal(principal: string): boolean {
  try {
    Principal.fromText(principal);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function getStringPrincipal() {
  const principal = store.getState().auth.userPrincipal;
  return principal.toText();
};
