import { TAllowance } from "@/@types/allowance";
import {
  CheckAllowanceParams,
  GetBalanceParams,
  HasAssetAllowanceParams,
  HasSubAccountsParams,
  TransferTokensParams,
  TransferFromAllowanceParams,
  SupportedStandardEnum,
} from "@/@types/icrc";
import { hexToUint8Array, toFullDecimal, toHoleBigInt } from "@/utils";
import { ApproveParams, IcrcLedgerCanister, TransferFromParams } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
import { AssetContact } from "@redux/models/ContactsModels";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function getCanister(assetAddress: string) {
  const agent = store.getState().auth.userAgent;
  const canisterId = Principal.fromText(assetAddress);
  const canister = IcrcLedgerCanister.create({
    agent,
    canisterId,
  });
  return canister;
}

function calculateExpirationAsBigInt(
  expirationString: string | undefined,
  isNoExpiration: boolean,
): bigint | undefined {
  if (isNoExpiration) {
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

export async function transferTokens(params: TransferTokensParams) {
  try {
    const { receiverPrincipal, transferAmount, assetAddress, decimal, fromSubAccount, toSubAccount } = params;
    const canister = getCanister(assetAddress);
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
    throw error;
  }
}

export async function transferTokensFromAllowance(params: TransferFromAllowanceParams) {
  try {
    const { receiverPrincipal, senderPrincipal, assetAddress, transferAmount, decimal, toSubAccount, fromSubAccount } =
      params;

    const canister = getCanister(assetAddress);

    const transferParams: TransferFromParams = {
      from: {
        owner: Principal.fromText(senderPrincipal),
        subaccount: [hexToUint8Array(fromSubAccount)],
      },
      to: {
        owner: Principal.fromText(receiverPrincipal),
        subaccount: [hexToUint8Array(toSubAccount)],
      },
      amount: toHoleBigInt(transferAmount, Number(decimal)),
    };

    await canister.transferFrom(transferParams);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSubAccountBalance(params: GetBalanceParams) {
  const { principal, subAccount, assetAddress, assetDecimal } = params;
  const canister = getCanister(assetAddress);

  const result = await canister.balance({
    owner: Principal.fromText(principal),
    subaccount: hexToUint8Array(subAccount),
  });
  return toFullDecimal(result, Number(assetDecimal));
}

export function createApproveAllowanceParams(allowance: TAllowance): ApproveParams {
  if (!allowance?.asset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"])) {
    throw new Error("ICRC-2 not supported");
  }

  const spenderPrincipal = allowance.spender.principal;
  const allowanceSubAccountId = allowance.subAccount.sub_account_id;
  const allowanceAssetDecimal = allowance.asset.decimal;
  const allowanceAmount = allowance.amount;

  const owner = Principal.fromText(spenderPrincipal);
  const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));
  const amount: bigint = toHoleBigInt(allowanceAmount, Number(allowanceAssetDecimal));
  const expiration = calculateExpirationAsBigInt(allowance.expiration, allowance?.noExpire);

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
  }
}

export async function getAllowanceDetails(params: CheckAllowanceParams) {
  try {
    const { spenderPrincipal, spenderSubaccount, accountPrincipal, assetAddress, assetDecimal } = params;

    const userPrincipal = store.getState().auth.userPrincipal;
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });
    const subAccountUint8Array = new Uint8Array(hexToUint8Array(spenderSubaccount));

    const result = await canister.allowance({
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

    const expires_at =
      result.expires_at.length <= 0 ? "" : dayjs(Number(result?.expires_at) / 1000000).format("YYYY-MM-DD HH:mm:ss");

    return { allowance, expires_at };
  } catch (e) {
    console.error(e);
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
        allowance: response?.allowance?.length === 0 ? undefined : response,
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
