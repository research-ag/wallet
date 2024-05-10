export const validateAmount = (amnt: string, dec: number): boolean => {
  // Regular expression to match a valid number with at most 'dec' decimals
  const regex = new RegExp(`^[0-9]+([.,][0-9]{0,${dec}})?$`);
  // Check if amount is a valid number
  if (!regex.test(amnt)) {
    return false;
  }
  // Additional check for decimal places
  const decimalPart = amnt.split(/[.,]/)[1];
  if (decimalPart && decimalPart.length > dec) {
    return false;
  }
  return true;
};

export const toFullDecimal = (numb: bigint | string, decimal: number, maxDecimals?: number) => {
  if (BigInt(numb) === BigInt(0)) return "0";

  let numbStr = numb.toString();
  if (decimal === numbStr.length) {
    if (maxDecimals === 0) return "0";
    const newNumber = numbStr.slice(0, maxDecimals || decimal).replace(/0+$/, "");
    return "0." + newNumber;
  } else if (decimal > numbStr.length) {
    for (let index = 0; index < decimal; index++) {
      numbStr = "0" + numbStr;
      if (numbStr.length > decimal) break;
    }
  }
  const holeStr = numbStr.slice(0, numbStr.length - decimal).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (maxDecimals === 0) return holeStr;

  const decimalStr = numbStr.slice(numbStr.length - decimal).replace(/0+$/, "");
  if (decimalStr === "") {
    return holeStr;
  } else {
    const newNumber = holeStr + "." + decimalStr.slice(0, maxDecimals || decimal);
    if (Number(newNumber) === 0) return "0";
    else return holeStr + "." + decimalStr.slice(0, maxDecimals || decimal);
  }
};

export const toHoleBigInt = (numb: string, decimal: number) => {
  const parts = numb.split(".");
  if (parts.length === 1 || parts[1] === "") {
    let addZeros = "";
    for (let index = 0; index < decimal; index++) {
      addZeros = "0" + addZeros;
    }
    return BigInt(parts[0].replace(/,/g, "") + addZeros);
  } else {
    const hole = parts[0].replace(/,/g, "");
    const dec = parts[1];
    let addZeros = "";
    for (let index = 0; index < decimal - dec.length; index++) {
      addZeros = "0" + addZeros;
    }
    return BigInt(hole + dec + addZeros);
  }
};

export const getUSDFromToken = (
  tokenAmount: string | number,
  marketPrice: string | number,
  decimal: string | number,
) => {
  return ((Number(tokenAmount) * Number(marketPrice)) / Math.pow(10, Number(decimal))).toFixed(2);
};

/**
 * Remove leading and trailing zeroes from a string representing an amount.
 * 000000.23 -> 0.23
 * 000000.2300 -> 0.23
 * 0.230000000 -> 0.23
 *
 * @param amount
 * @returns
 */
export function removeZeroesFromAmount(amount: string) {
  if (amount === "0") return "0";
  if (amount === "0.") return "0";

  if (!amount.includes(".")) {
    if (!amount.startsWith("0")) return amount;
    return amount.replace(/^0+/, "");
  }

  const parts = amount.split(".");
  const whole = parts[0].replace(/^0+/, "");
  const decimals = parts[1].replace(/0+$/, "");

  if (whole === "" && decimals === "") return "0";
  else if (whole === "") return `0.${decimals}`;
  else if (decimals === "") return whole;
  else return `${whole}.${decimals}`;
}