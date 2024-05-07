export const roundToDecimalN = (numb: number | string, decimal: number | string) => {
  return Math.round(Number(numb) * Math.pow(10, Number(decimal))) / Math.pow(10, Number(decimal));
};

export const toNumberFromUint8Array = (Uint8Arr: Uint8Array) => {
  const size = Uint8Arr.length;
  const buffer = Buffer.from(Uint8Arr);
  const result = buffer.readUIntBE(0, size);
  return result;
};
