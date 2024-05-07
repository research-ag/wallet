import { removeLeadingZeros } from "@/common/utils/strings";
import { isNullish, uint8ArrayToHexString } from "@dfinity/utils";

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
