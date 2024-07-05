export function isHexadecimalValid(hexadecimal: string) {
  const trimmedHex = hexadecimal.trim();
  const normalizedHex = trimmedHex?.startsWith("0x") ? trimmedHex.slice(2) : trimmedHex;
  return normalizedHex.length < 65 && /^[a-fA-F0-9]+$/.test(normalizedHex);
}

export function getNormalizedHex(hexadecimal: string) {
  const trimmedHex = hexadecimal.trim();
  const normalizedHex = trimmedHex?.startsWith("0x") ? trimmedHex.slice(2) : trimmedHex;
  return normalizedHex;
}

export function isObjectValid(object: any) {
  if (typeof object !== "object") return false;
  return Object.keys(object).length !== 0;
}
