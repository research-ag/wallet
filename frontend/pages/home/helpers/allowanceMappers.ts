import { TAllowance } from "@/@types/allowance";
import { Asset } from "@redux/models/AccountModels";

export function getAllowanceAsset(asset: Asset) {
  const { logo, name, address, decimal, tokenName, tokenSymbol, supportedStandards } = asset;

  return {
    logo,
    name,
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
