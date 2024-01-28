import { TAllowance } from "@/@types/allowance";
import { hexToUint8Array, toFullDecimal, toHoleBigInt } from "@/utils";
import { ApproveParams, IcrcLedgerCanister, IcrcTransferError, TransferFromParams } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
import { AssetContact, SubAccountContact } from "@redux/models/ContactsModels";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface TransferAmountParams {
  receiverPrincipal: string;
  assetAddress: string;
  transferAmount: string;
  decimal: string;
  fromSubAccount: string;
  toSubAccount: string;
}

export async function transferAmount(params: TransferAmountParams) {
  try {
    const { receiverPrincipal, transferAmount, assetAddress, decimal, fromSubAccount, toSubAccount } = params;

    const agent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({
      agent,
      canisterId,
    });

    const amount = toHoleBigInt(transferAmount, Number(decimal));

    await canister.transfer({
      to: {
        owner: Principal.fromText(receiverPrincipal),
        subaccount: [hexToUint8Array(toSubAccount)],
      },
      amount,
      from_subaccount: hexToUint8Array(fromSubAccount),
    });
  } catch (error) {
    console.error(error);
  }
}

interface TransferFromAllowanceParams extends TransferAmountParams {
  senderPrincipal: string;
  transactionFee: string;
}

export async function transferFromAllowance(params: TransferFromAllowanceParams) {
  try {
    const {
      receiverPrincipal,
      senderPrincipal,
      assetAddress,
      transferAmount,
      decimal,
      fromSubAccount,
      toSubAccount,
      transactionFee,
    } = params;

    const agent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({
      agent,
      canisterId,
    });

    console.log(params);

    const transferParams: TransferFromParams = {
      from: {
        owner: Principal.fromText(senderPrincipal),
        subaccount: [new Uint8Array(hexToUint8Array(fromSubAccount))],
      },
      to: {
        owner: Principal.fromText(receiverPrincipal),
        subaccount: [new Uint8Array(hexToUint8Array(toSubAccount))],
      },
      spender_subaccount: new Uint8Array(hexToUint8Array(fromSubAccount)),
      amount: toHoleBigInt(transferAmount, Number(decimal)),
      fee: toHoleBigInt(transactionFee, Number(decimal)),
    };

    const response = await canister.transferFrom(transferParams);
    console.log("allowance response", response);
  } catch (error) {
    console.log(error);
  }
}

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
    console.error(e);
    throw new Error("Error approving");
  }
}

interface CheckAllowanceParams {
  spenderPrincipal?: string;
  spenderSubaccount: string;
  accountPrincipal?: string;
  assetAddress: string;
  assetDecimal: string;
}

export async function checkAllowanceExist(params: CheckAllowanceParams) {
  try {
    const { spenderPrincipal, spenderSubaccount, accountPrincipal, assetAddress, assetDecimal } = params;

    const userPrincipal = store.getState().auth.userPrincipal;
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });
    const subAccountUint8Array = new Uint8Array(hexToUint8Array(spenderSubaccount));

    const result = await canister.allowance({
      spender: {
        // Who is allowance to transfer
        owner: spenderPrincipal ? Principal.fromText(spenderPrincipal) : userPrincipal,
        // Over the account is allowed to transfer
        subaccount: [subAccountUint8Array],
      },
      account: {
        // Who guarantee the allowance to spender.owner
        owner: accountPrincipal ? Principal.fromText(accountPrincipal) : userPrincipal,
        subaccount: [],
      },
    });

    return {
      allowance: Number(result.allowance) <= 0 ? "" : toFullDecimal(result.allowance, Number(assetDecimal)),
      expires_at:
        result.expires_at.length <= 0 ? "" : dayjs(Number(result?.expires_at) / 1000000).format("YYYY-MM-DD HH:mm:ss"),
    };
  } catch (e) {
    console.error(e);
  }
}

export async function hasSubAccountAllowances(
  accountPrincipal: string,
  subAccounts: SubAccountContact[],
  assetAddress: string,
  assetDecimal: string,
) {
  const newSubAccounts = [];

  for (let subAccountIndex = 0; subAccountIndex < subAccounts.length; subAccountIndex++) {
    const spenderSubaccount = subAccounts[subAccountIndex]?.sub_account_id;

    const response = await checkAllowanceExist({
      spenderSubaccount,
      accountPrincipal,
      assetAddress,
      assetDecimal,
    });

    if (response?.allowance) {
      newSubAccounts.push({
        ...subAccounts[subAccountIndex],
        allowance: response,
      });
    } else {
      newSubAccounts.push(subAccounts[subAccountIndex]);
    }
  }
  return newSubAccounts;
}

export async function hasSubAccountAssetAllowances(
  accountPrincipal: string,
  assets: AssetContact[],
): Promise<AssetContact[] | []> {
  const newAssets: AssetContact[] = [];

  for (let assetIndex = 0; assetIndex < assets.length; assetIndex++) {
    const subAccounts = assets[assetIndex].subaccounts;

    const currentAsset: AssetContact = {
      ...assets[assetIndex],
      subaccounts: [],
    };

    for (let subAccountIndex = 0; subAccountIndex < subAccounts?.length; subAccountIndex++) {
      const spenderSubaccount = subAccounts[subAccountIndex]?.sub_account_id;
      const assetAddress = assets[assetIndex].address;
      const assetDecimal = assets[assetIndex].decimal;

      const response = await checkAllowanceExist({
        accountPrincipal,
        assetAddress,
        spenderSubaccount,
        assetDecimal,
      });

      if (response?.allowance) {
        currentAsset.subaccounts.push({
          ...subAccounts[subAccountIndex],
          allowance: response,
        });
      } else {
        currentAsset.subaccounts.push(subAccounts[subAccountIndex]);
      }
    }

    const assetHasAllowance = currentAsset.subaccounts.some((subaccount) => subaccount?.allowance);

    if (assetHasAllowance) {
      currentAsset.hasAllowance = true;
    }

    newAssets.push(currentAsset);
  }
  return newAssets;
}
