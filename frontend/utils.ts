import { Principal } from "@dfinity/principal";
import { getCrc32 } from "@dfinity/principal/lib/cjs/utils/getCrc";
import { sha224 } from "@dfinity/principal/lib/cjs/utils/sha224.js";
import { Buffer } from "buffer";
import bigInt from "big-integer";
import store from "@redux/Store";
import { Transaction, Operation, RosettaTransaction, Asset } from "./redux/models/AccountModels";
import { IcrcTokenMetadataResponse, IcrcAccount, encodeIcrcAccount } from "@dfinity/ledger";
import {
  OperationStatusEnum,
  OperationTypeEnum,
  TransactionTypeEnum,
  TransactionType,
  SpecialTxTypeEnum,
} from "./const";
import { Account, Transaction as T } from "@dfinity/ledger/dist/candid/icrc1_index";
import { isNullish, uint8ArrayToHexString, bigEndianCrc32, encodeBase32 } from "@dfinity/utils";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/nns";

export const MILI_PER_SECOND = 1000000;

export const getEncodeCrc = ({ owner, subaccount }: IcrcAccount): string => {
  const crc = bigEndianCrc32(Uint8Array.from([...owner.toUint8Array(), ...(subaccount || toUint8Array(0))]));
  return encodeBase32(crc);
};

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

export const checkHexString = (e: string) => {
  let newValue = e.trim();
  if (e.trim().slice(0, 2).toLowerCase() === "0x") newValue = newValue.substring(2);
  return (newValue === "" || /^[a-fA-F0-9]+$/.test(newValue)) && newValue.length < 65;
};

export const getICRC1Acc = ({ owner, subaccount }: IcrcAccount): string => {
  const crc = encodeIcrcAccount({ owner, subaccount });
  return crc;
};

export const getFirstNFrom = (address: string, digits: number) => {
  return `${address.slice(0, digits).toUpperCase()}`;
};

export const getFirstNChars = (str: string, digits: number) => {
  if (str.length > digits) return `${str.slice(0, digits)}...`;
  else return str;
};

export const shortAddress = (address: string, digitsL: number, digitsR: number, prefix?: string, sufix?: string) => {
  return `${prefix ? prefix : ""}${address.slice(0, digitsL)} ... ${address.slice(-digitsR)}${sufix ? sufix : ""}`;
};

export const principalToAccountIdentifier = (p: string, s?: number[] | number) => {
  const padding = Buffer.from("\x0Aaccount-id");
  const array = new Uint8Array([...padding, ...Principal.fromText(p).toUint8Array(), ...getSubAccountArray(s)]);
  const hash = sha224(array);
  const checksum = to32bits(getCrc32(hash));
  const array2 = new Uint8Array([...checksum, ...hash]);
  return array2;
};
export const roundToDecimalN = (numb: number | string, decimal: number | string) => {
  return Math.round(Number(numb) * Math.pow(10, Number(decimal))) / Math.pow(10, Number(decimal));
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
    return BigInt(parts[0] + addZeros);
  } else {
    const hole = parts[0];
    const dec = parts[1];
    let addZeros = "";
    for (let index = 0; index < decimal - dec.length; index++) {
      addZeros = "0" + addZeros;
    }
    return BigInt(hole + dec + addZeros);
  }
};

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

export const getUSDfromToken = (
  tokenAmount: string | number,
  marketPrice: string | number,
  decimal: string | number,
) => {
  return ((Number(tokenAmount) * Number(marketPrice)) / Math.pow(10, Number(decimal))).toFixed(2);
};

export const removeLeadingZeros = (text: string): string => text.replace(/^0+/, "");

export const getSubAccountNumber = (subaccount?: Uint8Array, prefix?: string, sufix?: string) => {
  if (isNullish(subaccount)) return `${prefix ? prefix : ""}0${sufix ? sufix : ""}`;

  const subaccountText = removeLeadingZeros(uint8ArrayToHexString(subaccount));

  if (subaccountText.length === 0) {
    return `${prefix ? prefix : ""}0${sufix ? sufix : ""}`;
  }
  return `${prefix ? prefix : ""}${subaccountText}${sufix ? sufix : ""}`;
};

export const getSubAccountUint8Array = (subaccount: string | number) => {
  return new Uint8Array(getSubAccountArray(Number(subaccount)));
};

export const getSubAccountArray = (s?: number[] | number) => {
  if (Array.isArray(s)) {
    return s.concat(Array(32 - s.length).fill(0));
  } else {
    return Array(28)
      .fill(0)
      .concat(to32bits(s ? s : 0));
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

export const subUint8ArrayToHex = (sub: Uint8Array | undefined) => {
  if (sub) {
    const hex = removeLeadingZeros(Buffer.from(sub).toString("hex"));
    if (hex === "") return "0";
    else return hex;
  } else {
    return "0";
  }
};

export const to32bits = (num: number) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const toUint8Array = (num: number) => {
  return new Uint8Array(num);
};

export const toNumberFromUint8Array = (Uint8Arr: Uint8Array) => {
  const size = Uint8Arr.length;
  const buffer = Buffer.from(Uint8Arr);
  const result = buffer.readUIntBE(0, size);
  return result;
};

export const getAddress = (
  type: TransactionType,
  fromAddress: string,
  fromSub: string,
  accountAddres: string,
  accountSub: string,
) => {
  if (type !== TransactionTypeEnum.Enum.NONE) {
    if (type === TransactionTypeEnum.Enum.RECEIVE) {
      return false;
    } else {
      return true;
    }
  } else {
    if (accountAddres !== fromAddress) {
      return false;
    } else {
      if (fromSub === accountSub) {
        return true;
      } else {
        return false;
      }
    }
  }
};

export const getICPSubaccountsArray = async () => {
  const sub: string[] = [];
  const myAgent = store.getState().auth.userAgent;
  const myPrincipal = await myAgent.getPrincipal();

  for (let index = 0; index <= 10; index++) {
    sub[index] = AccountIdentifier.fromPrincipal({
      principal: myPrincipal,
      subAccount: SubAccountNNS.fromID(Number(index)),
    }).toHex();
  }

  return sub;
};

export const getAccountIdentifier = (pricipal: string, sub: number) => {
  return AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(pricipal),
    subAccount: SubAccountNNS.fromID(Number(sub)),
  }).toHex();
};

export const formatIcpTransaccion = (accountId: string, rosettaTransaction: RosettaTransaction): Transaction => {
  const {
    operations,
    metadata: { timestamp, block_height },
    transaction_identifier: { hash },
  } = rosettaTransaction;
  const transaction = { status: OperationStatusEnum.Enum.COMPLETED } as Transaction;
  operations?.forEach((operation: Operation, i: number) => {
    const value = BigInt(operation.amount.value);
    const amount = value.toString();
    if (operation.type === OperationTypeEnum.Enum.FEE) {
      transaction.fee = amount;
      return;
    }

    if (value > 0) {
      transaction.to = operation.account.address;
    } else if (value < 0) {
      transaction.from = operation.account.address;
    } else {
      if (i === 0) {
        transaction.from = operation.account.address;
      }
      if (i === 1) {
        transaction.to = operation.account.address;
      }
    }

    if (
      transaction.status === OperationStatusEnum.Enum.COMPLETED &&
      operation.status !== OperationStatusEnum.Enum.COMPLETED
    )
      transaction.status = operation.status;

    transaction.type = transaction.to === accountId ? TransactionTypeEnum.Enum.RECEIVE : TransactionTypeEnum.Enum.SEND;
    transaction.amount = amount;
    transaction.canisterId = import.meta.env.VITE_ICP_LEDGER_CANISTER_ID;
    transaction.idx = block_height.toString();
    transaction.symbol = operation.amount.currency.symbol;
  });

  return {
    ...transaction,
    hash,
    timestamp: Math.floor(timestamp / MILI_PER_SECOND),
  } as Transaction;
};

export const formatckBTCTransaccion = (
  ckBTCTransaction: T,
  id: bigint,
  principal: string,
  symbol: string,
  canister: string,
  subNumber?: string,
): Transaction => {
  const { timestamp, transfer, mint, burn, kind } = ckBTCTransaction;
  const trans = { status: OperationStatusEnum.Enum.COMPLETED, kind: kind } as Transaction;
  // Check Tx type ["transfer", "mint", "burn"]
  if (kind === SpecialTxTypeEnum.Enum.mint)
    mint.forEach(
      (operation: { to: Account; memo: [] | [Uint8Array]; created_at_time: [] | [bigint]; amount: bigint }) => {
        // Get Tx data from Mint record
        const value = operation.amount;
        const amount = value.toString();
        trans.to = (operation.to.owner as Principal).toString();
        if (operation.to.subaccount.length > 0)
          trans.toSub = `0x${subUint8ArrayToHex((operation.to.subaccount as [Uint8Array])[0])}`;
        else trans.toSub = "0x0";
        trans.from = "";
        trans.fromSub = "";
        trans.canisterId = canister;
        trans.symbol = symbol;
        trans.amount = amount;

        // Get AccountIdentifier of Receiver
        let subaccTo: SubAccountNNS | undefined = undefined;
        try {
          subaccTo = SubAccountNNS.fromBytes((operation.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
        } catch {
          subaccTo = undefined;
        }
        trans.idx = id.toString();
        trans.identityTo = AccountIdentifier.fromPrincipal({
          principal: operation.to.owner as Principal,
          subAccount: subaccTo,
        }).toHex();
        trans.type = TransactionTypeEnum.Enum.RECEIVE;
      },
    );
  else if (kind === SpecialTxTypeEnum.Enum.burn)
    burn.forEach(
      // Get Tx data from Burn record
      (operation: { from: Account; memo: [] | [Uint8Array]; created_at_time: [] | [bigint]; amount: bigint }) => {
        const value = operation.amount;
        const amount = value.toString();
        trans.from = (operation.from.owner as Principal).toString();
        if (operation.from.subaccount.length > 0)
          trans.fromSub = `0x${subUint8ArrayToHex((operation.from.subaccount as [Uint8Array])[0])}`;
        else trans.fromSub = "0x0";
        trans.to = "";
        trans.toSub = "";
        trans.canisterId = canister;
        trans.symbol = symbol;
        trans.amount = amount;

        // Get AccountIdentifier of Sender
        let subaccFrom: SubAccountNNS | undefined = undefined;
        try {
          subaccFrom = SubAccountNNS.fromBytes((operation.from.subaccount as [Uint8Array])[0]) as SubAccountNNS;
        } catch {
          subaccFrom = undefined;
        }
        trans.idx = id.toString();
        trans.identityFrom = AccountIdentifier.fromPrincipal({
          principal: operation.from.owner as Principal,
          subAccount: subaccFrom,
        }).toHex();
        trans.type = TransactionTypeEnum.Enum.SEND;
      },
    );
  else
    transfer?.forEach((operation: any) => {
      // Get Tx data from transfer record
      const value = operation.amount;
      const amount = value.toString();
      trans.to = (operation.to.owner as Principal).toString();
      trans.from = (operation.from.owner as Principal).toString();

      if (operation.to.subaccount.length > 0)
        trans.toSub = `0x${subUint8ArrayToHex((operation.to.subaccount as [Uint8Array])[0])}`;
      else trans.toSub = "0x0";

      if (operation.from.subaccount.length > 0)
        trans.fromSub = `0x${subUint8ArrayToHex((operation.from.subaccount as [Uint8Array])[0])}`;
      else trans.fromSub = "0x0";

      const subCheck = subNumber;
      if (trans.from === principal && trans.fromSub === subCheck) {
        trans.type = TransactionTypeEnum.Enum.SEND;
      } else {
        trans.type = TransactionTypeEnum.Enum.RECEIVE;
      }

      trans.canisterId = canister;
      trans.symbol = symbol;
      trans.amount = amount;
      trans.idx = id.toString();

      // Get AccountIdentifier of Receiver
      let subaccTo: SubAccountNNS | undefined = undefined;
      try {
        subaccTo = SubAccountNNS.fromBytes((operation.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
      } catch {
        subaccTo = undefined;
      }
      trans.identityTo = AccountIdentifier.fromPrincipal({
        principal: operation.to.owner as Principal,
        subAccount: subaccTo,
      }).toHex();

      // Get AccountIdentifier of Sender
      let subaccFrom: SubAccountNNS | undefined = undefined;
      try {
        subaccFrom = SubAccountNNS.fromBytes((operation.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
      } catch {
        subaccFrom = undefined;
      }
      trans.identityFrom = AccountIdentifier.fromPrincipal({
        principal: operation.from.owner as Principal,
        subAccount: subaccFrom,
      }).toHex();
    });
  return {
    ...trans,
    timestamp: Math.floor(Number(timestamp) / MILI_PER_SECOND),
  } as Transaction;
};

export const getMetadataInfo = (myMetadata: IcrcTokenMetadataResponse) => {
  let symbol = "symbol";
  let name = "symbol";
  let decimals = 0;
  let logo = "";
  let fee = "";

  myMetadata.map((dt) => {
    if (dt[0] === "icrc1:symbol") {
      const auxSymbol = dt[1] as { Text: string };
      symbol = auxSymbol.Text;
    }
    if (dt[0] === "icrc1:name") {
      const auxName = dt[1] as { Text: string };
      name = auxName.Text;
    }
    if (dt[0] === "icrc1:decimals") {
      const auxDec = dt[1] as any;
      decimals = Number(auxDec.Nat);
    }
    if (dt[0] === "icrc1:logo") {
      const auxName = dt[1] as { Text: string };
      logo = auxName.Text;
    }
    if (dt[0] === "icrc1:fee") {
      const auxName = dt[1] as { Text: string };
      fee = auxName.Text;
    }
  });

  return { symbol, name, decimals, logo, fee };
};

export const getInitialFromName = (name: string, length: number) => {
  if (name.length === 0) {
    return "";
  } else {
    const names = name.split(" ");
    let initials = "";
    names.map((nm) => {
      if (nm.trim().length > 0) initials = initials + nm.trim()[0];
    });
    return initials.toUpperCase().slice(0, length);
  }
};

export const getAssetSymbol = (symbol: string, assets: Array<Asset>) => {
  return assets.find((a: Asset) => {
    return a.tokenSymbol === symbol;
  })?.symbol;
};
