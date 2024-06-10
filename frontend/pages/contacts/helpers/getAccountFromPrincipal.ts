import { Principal } from "@dfinity/principal";
import { Buffer } from "buffer";

export default function getAccountFromPrincipal(principal: string) {
  const principalBytes = Principal.fromText(principal).toUint8Array();
  const length = principalBytes.length.toString(16);
  const hex = Buffer.from(principalBytes).toString("hex");

  return {
    subaccount: length + hex,
    subAccountId: `0x${length + hex}`,
  };
}
