import { TAllowance } from "@/@types/allowance";
import { hexToUint8Array } from "@/utils";
import { ApproveParams, IcrcLedgerCanister } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function generateApproveAllowance(allowance: TAllowance): ApproveParams {
  const spenderPrincipal = allowance.spender.principal;
  const allowanceSubAccountId = allowance.subAccount.sub_account_id;
  const allowanceAssetDecimal = allowance.asset.decimal;
  const allowanceAmount = allowance.amount;

  const owner = Principal.fromText(spenderPrincipal);
  const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));
  const amount: bigint = toHoleBigInt(allowanceAmount, Number(allowanceAssetDecimal));
  const expirationTimeStamp =
    !allowance.noExpire && allowance?.expiration ? dayjs.utc(allowance?.expiration).valueOf() * 1000000 : undefined;
  const expiration = expirationTimeStamp ? BigInt(expirationTimeStamp) : undefined;

  return {
    spender: {
      owner,
      subaccount: [subAccountUint8Array],
    },
    amount: amount,
    expires_at: expiration,
  };
}

export async function ICRCApprove(params: ApproveParams, assetAddress: string): Promise<bigint | undefined> {
  try {
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });
    const result = await canister.approve(params);
    return result;
  } catch (e) {
    console.log(e);
    throw new Error("Error approving");
  }
}

const toHoleBigInt = (numb: string, decimal: number) => {
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

async function hasAllowance(principal: string, assetAddress: string, allowanceSubAccountId: string) {
  try {
    const accountId = store.getState().auth.userPrincipal;
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });
    const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));

    const result = await canister.allowance({
      spender: {
        owner: Principal.fromText(principal),
        subaccount: [],
      },
      account: {
        owner: accountId,
        subaccount: [subAccountUint8Array],
      },
    });

    return result;
  } catch (e) {
    console.log(e);
    throw new Error("Error verifying");
  }
}
