import {
  CheckAllowanceParams,
  HasAssetAllowanceParams,
  HasSubAccountsParams,
  SupportedStandardEnum,
} from "@/@types/icrc";
import { hexToUint8Array, toFullDecimal, toHoleBigInt } from "@/utils";
import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
import { AssetContact } from "@redux/models/ContactsModels";
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";
import dayjs from "dayjs";
import { ApproveParams } from "@dfinity/ledger-icrc";
import { getCanister } from "./getIcrcCanister";
import { TAllowance } from "@/@types/allowance";

function calculateExpirationAsBigInt(
  expirationString: string | undefined,
  hasExpiration?: boolean,
): bigint | undefined {
  if (hasExpiration) {
    return undefined;
  }

  if (!expirationString) {
    return undefined;
  }

  try {
    const expirationTimestamp = dayjs.utc(expirationString).valueOf() * 1000000;
    return BigInt(expirationTimestamp);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export function createApproveAllowanceParams(allowance: TAllowance): ApproveParams {
  if (!allowance?.asset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"])) {
    throw new Error("ICRC-2 not supported");
  }

  const spenderPrincipal = allowance.spender;
  const allowanceSubAccountId = allowance.subAccountId;
  const allowanceAssetDecimal = allowance.asset.decimal;
  const allowanceAmount = allowance.amount || "0";

  const owner = Principal.fromText(spenderPrincipal);
  const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));
  const amount: bigint = toHoleBigInt(allowanceAmount, Number(allowanceAssetDecimal));
  const expiration = calculateExpirationAsBigInt(allowance.expiration);
  return {
    spender: {
      owner,
      subaccount: [],
    },
    from_subaccount: subAccountUint8Array,
    amount: amount,
    expires_at: expiration,
  };
}

export async function submitAllowanceApproval(
  params: ApproveParams,
  assetAddress: string,
): Promise<bigint | undefined> {
  try {
    const canister = getCanister(assetAddress);
    const result = await canister.approve(params);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// TODO: IcrcLedgerCanister.allowance from @dfinity/ledger-icrc perform call instead of query to get the allowance, remove this function once the issue is resolved in the ledger-icrc package
export async function getAllowanceDetails(params: CheckAllowanceParams) {
  try {
    const { spenderPrincipal, spenderSubaccount, accountPrincipal, assetAddress, assetDecimal } = params;

    const userPrincipal = store.getState().auth.userPrincipal;
    const agent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const subAccountUint8Array = new Uint8Array(hexToUint8Array(spenderSubaccount));

    const ledgerActor = Actor.createActor<LedgerActor>(LedgerFactory, {
      agent,
      canisterId,
    });

    const result = await ledgerActor.icrc2_allowance({
      spender: {
        owner: spenderPrincipal ? Principal.fromText(spenderPrincipal) : userPrincipal,
        subaccount: [],
      },
      account: {
        owner: accountPrincipal ? Principal.fromText(accountPrincipal) : userPrincipal,
        subaccount: [subAccountUint8Array],
      },
    });

    const allowance = Number(result.allowance) <= 0 ? "" : toFullDecimal(result.allowance, Number(assetDecimal));

    const expires_at = result.expires_at.length <= 0 ? "" : dayjs(Number(result?.expires_at) / 1000000).format();

    return { allowance, expires_at };
  } catch (e) {
    console.error(e);
    return { allowance: "", expires_at: "" };
  }
}

export async function retrieveSubAccountsWithAllowance(params: HasSubAccountsParams) {
  const { accountPrincipal, subAccounts, assetAddress, assetDecimal } = params;

  const subAccountsWithAllowance = await Promise.all(
    subAccounts.map(async (subAccount) => {
      const spenderSubaccount = subAccount?.sub_account_id;
      const response = await getAllowanceDetails({
        spenderSubaccount,
        accountPrincipal,
        assetAddress,
        assetDecimal,
      });

      return {
        ...subAccount,
        // TODO: check the right way to handle the allowance
        allowance: response,
        // allowance: response?.allowance?.length === 0 ? undefined : response,
      };
    }),
  );

  return subAccountsWithAllowance;
}

export async function retrieveAssetsWithAllowance(params: HasAssetAllowanceParams): Promise<AssetContact[] | []> {
  const { accountPrincipal, assets } = params;

  const supportedAssets = assets?.filter((asset) =>
    asset.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]),
  );

  const noSupportedAssets = assets?.filter(
    (asset) => !asset.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]),
  );

  const assetsWithAllowance = await Promise.all(
    supportedAssets.map(async (asset) => {
      const subAccountsWithAllowance = await retrieveSubAccountsWithAllowance({
        accountPrincipal,
        subAccounts: asset.subaccounts,
        assetAddress: asset.address,
        assetDecimal: asset.decimal,
      });

      return {
        ...asset,
        subaccounts: subAccountsWithAllowance,
      };
    }),
  );

  return [...assetsWithAllowance, ...noSupportedAssets];
}
