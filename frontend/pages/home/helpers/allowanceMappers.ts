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
