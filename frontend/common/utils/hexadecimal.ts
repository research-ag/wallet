import bigInt from "big-integer";

export const hexToNumber = (hexFormat: string) => {
  if (hexFormat.slice(0, 2) !== "0x") return undefined;
  const hex = hexFormat.substring(2);
  if (/^[a-fA-F0-9]+$/.test(hex)) {
    let numb = bigInt();
    for (let index = 0; index < hex.length; index++) {
      const digit = hex[hex.length - index - 1];
      numb = numb.add(
        bigInt(16)
          .pow(bigInt(index))
          .multiply(bigInt(`0x${digit}`)),
      );
    }
    return numb;
  } else {
    return undefined;
  }
};

export const hexToUint8Array = (hex: string) => {
  const zero = bigInt(0);
  const n256 = bigInt(256);
  let bigNumber = hexToNumber(hex);
  if (bigNumber) {
    const result = new Uint8Array(32);
    let i = 0;
    while (bigNumber.greater(zero)) {
      result[32 - i - 1] = bigNumber.mod(n256).toJSNumber();
      bigNumber = bigNumber.divide(n256);
      i += 1;
    }
    return result;
  } else return new Uint8Array(32);
};

export const hexadecimalToUint8Array = (hexadecimalSubAccount: string): [] | [Uint8Array | number[]] => {
  if (hexadecimalSubAccount.length === 0) return [];
  else return [hexToUint8Array(hexadecimalSubAccount)];
};

export const checkHexString = (e: string) => {
  let newValue = e.trim();
  if (e.trim().slice(0, 2).toLowerCase() === "0x") newValue = newValue.substring(2);
  return (newValue === "" || /^[a-fA-F0-9]+$/.test(newValue)) && newValue.length < 65;
};
