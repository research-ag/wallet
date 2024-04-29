import { TAllowance } from "@/@types/allowance";
import { Asset } from "@redux/models/AccountModels";

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
