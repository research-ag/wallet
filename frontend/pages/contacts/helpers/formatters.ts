import logger from "@/common/utils/logger";

function removeLeadingZerosFromHex(value: string) {
  // 0x002001 -> 0x2001
  // 0x000401 -> 0x401
  // 0x040000 -> 0x40000
  // 0x102000 -> 0x102000
  if (!value.startsWith("0x")) {
    logger.debug(`removeLeadingZerosFromHex: value does not start with 0x: ${value}`);
    return value;
  }

  let i = 2;
  while (i < value.length && value[i] === "0") {
    i++;
  }

  return `0x${value.slice(i)}`;
}

function removeLoadingZerosFromNumber(value: string) {
  // 002001 -> 2001
  // 000401 -> 401
  // 040000 -> 40000
  // 102000 -> 102000
  if (value.startsWith("0x")) {
    logger.debug(`removeLoadingZerosFromNumber: value starts with 0x: ${value}`);
    return value;
  }

  if (value.length === 2 && value.split("").every((char) => char === "0")) {
    return "0";
  }

  let i = 0;
  while (i < value.length && value[i] === "0") {
    i++;
  }

  return value.slice(i);
}

export function getSubAccountId(value: string | undefined): string {
  // undefined -> ""
  if (!value) return "";

  // "" -> ""
  if (value.length === 0) return "";

  // 0 -> 0x0
  // 3 -> 0x3
  // 54 -> 0x54
  // x -> 0x
  if (value.length === 1) {
    if (value.toLowerCase() === "x") return "0x";
    return `0x${value}`;
  }

  // 0x -> 0x0
  // 23 -> 0x23
  // 54 -> 0x54
  // 0X -> 0x0
  if (value.length === 2) {
    if (value.toLocaleLowerCase() === "0x") return "0x";
    if (value[0] === "0") return `0x${value.slice(1)}`;
    return `0x${value}`;
  }

  // 0x23 -> 0x23
  // 0X23 -> 0x23
  // 0x54234 -> 0x54234
  // 0X54234 -> 0x54234
  // 023120x -> 0x23120x
  if (value.length > 2) {
    if (value === "0x0") return "0x0";
    if (
      value
        .slice(2)
        .split("")
        .every((char) => char === "0")
    )
      return "0x0";
    if (value.slice(0, 2).toLocaleLowerCase() === "0x") {
      return removeLeadingZerosFromHex(value);
    }

    return `0x${removeLoadingZerosFromNumber(value)}`;
  }

  return value;
}

export function getSubAccount(value: string | undefined) {
  if (!value || value.length === 0) return "";

  if (value.length >= 2) {
    if (value.slice(0, 2).toLocaleLowerCase() === "0x") {
      if (value.length === 3 && value[2] === "0") return value;
      return removeLeadingZerosFromHex(value);
    }

    return removeLoadingZerosFromNumber(value);
  }

  return value;
}
