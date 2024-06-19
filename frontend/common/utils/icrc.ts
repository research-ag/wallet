import { bigEndianCrc32, encodeBase32 } from "@dfinity/utils";
import {
  IcrcMetadataResponseEntries,
  IcrcTokenMetadataResponse,
  IcrcAccount,
  encodeIcrcAccount,
} from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { getCrc32 } from "@dfinity/principal/lib/cjs/utils/getCrc";
import { sha224 } from "@dfinity/principal/lib/cjs/utils/sha224.js";
import { TransactionType, TransactionTypeEnum } from "@/common/const";
import store from "@redux/Store";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Asset } from "@redux/models/AccountModels";

export const getEncodeCrc = ({ owner, subaccount }: IcrcAccount): string => {
  const crc = bigEndianCrc32(Uint8Array.from([...owner.toUint8Array(), ...(subaccount || toUint8Array(0))]));
  return encodeBase32(crc);
};

export const getICRC1Acc = ({ owner, subaccount }: IcrcAccount): string => {
  const crc = encodeIcrcAccount({ owner, subaccount });
  return crc;
};

export const shortAddress = (address: string, digitsL: number, digitsR: number, prefix?: string, sufix?: string) => {
  if (address?.length || 0 > digitsL + digitsR)
    return `${prefix ? prefix : ""}${address.slice(0, digitsL)} ... ${address.slice(-digitsR)}${sufix ? sufix : ""}`;
  else return address;
};

export const principalToAccountIdentifier = (p: string, s?: number[] | number) => {
  const padding = Buffer.from("\x0Aaccount-id");
  const array = new Uint8Array([...padding, ...Principal.fromText(p).toUint8Array(), ...getSubAccountArray(s)]);
  const hash = sha224(array);
  const checksum = to32bits(getCrc32(hash));
  const array2 = new Uint8Array([...checksum, ...hash]);
  return array2;
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

export const to32bits = (num: number) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const toUint8Array = (num: number) => {
  return new Uint8Array(num);
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

export const getMetadataInfo = (myMetadata: IcrcTokenMetadataResponse) => {
  let symbol = "symbol";
  let name = "symbol";
  let decimals = 0;
  let logo = "";
  let fee = "";

  myMetadata.map((dt) => {
    if (dt[0] === IcrcMetadataResponseEntries.SYMBOL) {
      const auxSymbol = dt[1] as { Text: string };
      symbol = auxSymbol.Text;
    }
    if (dt[0] === IcrcMetadataResponseEntries.NAME) {
      const auxName = dt[1] as { Text: string };
      name = auxName.Text;
    }
    if (dt[0] === IcrcMetadataResponseEntries.DECIMALS) {
      const auxDec = dt[1] as any;
      decimals = Number(auxDec.Nat);
    }
    if (dt[0] === IcrcMetadataResponseEntries.LOGO) {
      const auxName = dt[1] as { Text: string };
      logo = auxName.Text;
    }
    if (dt[0] === IcrcMetadataResponseEntries.FEE) {
      const auxName = dt[1] as any;
      fee = String(auxName.Nat);
    }
  });

  return { symbol, name, decimals, logo, fee };
};

export const getAssetSymbol = (symbol: string, assets: Array<Asset>) => {
  return assets.find((a: Asset) => {
    return a.tokenSymbol === symbol || a.symbol === symbol;
  })?.symbol;
};
