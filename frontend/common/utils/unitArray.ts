import { Buffer } from "buffer";
import { removeLeadingZeros } from "@/common/utils/strings";
import { isNullish, uint8ArrayToHexString } from "@dfinity/utils";
import { Principal } from "@dfinity/principal";

export const uint8ArrayToNum = (arr: Uint8Array | undefined, len?: number) => {
  if (arr) {
    const size = len ? len : 32;
    let num = 0;
    for (let i = 0; i < size; i++) {
      num += Math.pow(256, size - 1 - i) * arr[i];
    }
    return num;
  } else return 0;
};

export const subUint8ArrayToHex = (sub: Uint8Array | number[] | undefined) => {
  if (sub) {
    const hex = removeLeadingZeros(Buffer.from(sub).toString("hex"));
    if (hex === "") return "0";
    else return hex;
  } else {
    return "0";
  }
};

export const getSubAccountNumber = (subaccount?: Uint8Array, prefix?: string, sufix?: string) => {
  if (isNullish(subaccount)) return `${prefix ? prefix : ""}0${sufix ? sufix : ""}`;

  const subaccountText = removeLeadingZeros(uint8ArrayToHexString(subaccount));

  if (subaccountText.length === 0) {
    return `${prefix ? prefix : ""}0${sufix ? sufix : ""}`;
  }
  return `${prefix ? prefix : ""}${subaccountText}${sufix ? sufix : ""}`;
};

export const hexStringToPrincipal = (hexString: string) => {
  // Remove the '0x' prefix
  hexString = hexString.slice(2);

  // Extract the length (first byte in hex)
  const lengthHex = hexString.substring(0, 2);
  const length = parseInt(lengthHex, 16);

  // Extract the rest as the hexadecimal representation of the bytes
  const dataHex = hexString.substring(2);

  // Convert the hex string back to Uint8Array
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    const byteHex = dataHex.substring(i * 2, i * 2 + 2);
    bytes[i] = parseInt(byteHex, 16);
  }

  return Principal.fromUint8Array(bytes);
};
