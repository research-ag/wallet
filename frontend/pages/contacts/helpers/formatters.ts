export function getSubAccountId(value: string | undefined) {
  // undefined -> ""
  if (!value) return "";

  // "" -> ""
  if (value.length === 0) return "";

  // 0 -> 0x0
  // 3 -> 0x3
  // 54 -> 0x54
  if (value.length === 1) return `0x${value}`;

  // 0x -> 0x0
  // 23 -> 0x23
  // 54 -> 0x54
  // 0X -> 0x0
  if (value.length === 2) {
    if (value.toLocaleLowerCase() === "0x") return "0x";
    return `0x${value}`;
  }

  // 0x23 -> 0x23
  // 0X23 -> 0x23
  // 0x54234 -> 0x54234
  // 0X54234 -> 0x54234
  // 023120x -> 0x23120x
  if (value.length > 2) {
    if (value.slice(0, 2).toLocaleLowerCase() === "0x") return value;
    return `0x${value}`;
  }

  return value;
}

export function getSubAccount(value: string | undefined) {
  if (!value || value.length === 0) return "";
  if (value.length >= 2) {
    if (value.slice(0, 2).toLocaleLowerCase() === "0x") return `0x${value.slice(2)}`;
  }

  return value;
}
