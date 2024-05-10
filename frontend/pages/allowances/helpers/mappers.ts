import { TAllowance } from "@/@types/allowance";
import { Asset } from "@redux/models/AccountModels";
import store from "@redux/Store";

export function getAllowanceAsset(asset: Asset) {
  const { logo, name, symbol, address, decimal, tokenName, tokenSymbol, supportedStandards } = asset;

  return {
    logo,
    name,
    symbol,
    address,
    decimal,
    tokenName,
    tokenSymbol,
    supportedStandards,
  };
}

export function getToCreateAllowance(allowance: TAllowance) {
  const { asset, subAccountId, spender } = allowance;
  return { asset, subAccountId, spender };
}

interface AllowanceWithNames extends TAllowance {
  subAccountName?: string;
  spenderName?: string;
}

export function includeNamesToAllowances(allowances: TAllowance[]) {
  const contacts = store.getState().contacts.contacts;
  const assets = store.getState().asset.list.assets;

  const fullAllowances = allowances.map((allowance) => {
    const contact = contacts.find((contact) => contact.principal === allowance.spender);
    const asset = assets.find((asset) => asset.tokenSymbol === allowance.asset.tokenSymbol);
    const subAccount = asset?.subAccounts.find((subAccount) => subAccount.sub_account_id === allowance.subAccountId);

    const subAccountName = subAccount?.name;
    const spenderName = contact?.name;

    return {
      ...allowance,
      spenderName,
      subAccountName,
    };
  });

  return fullAllowances;
}

export function excludeNamesFromAllowance(allowances: AllowanceWithNames[]) {
  // eslint-disable-next-line
  return allowances.map(({ subAccountName, spenderName, ...props }) => props);
}
