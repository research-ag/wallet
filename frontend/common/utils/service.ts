import { ServiceSubAccount } from "@/@types/transactions";
import { Principal } from "@dfinity/principal";
import { Asset } from "@redux/models/AccountModels";
import { ServiceAsset, ServiceAssetData } from "@redux/models/ServiceModels";
import { Buffer } from "buffer";

export const assetServiceToData = (serviceAsset: ServiceAsset): ServiceAssetData => {
  return {
    tokenSymbol: serviceAsset.tokenSymbol,
    tokenName: serviceAsset.tokenName,
    decimal: serviceAsset.decimal,
    shortDecimal: serviceAsset.shortDecimal,
    logo: serviceAsset.logo,
    principal: serviceAsset.principal,
  };
};

export const assetsServiceToData = (serviceAssets: ServiceAsset[]): ServiceAssetData[] => {
  return serviceAssets.map((ast) => {
    return assetServiceToData(ast);
  });
};

export const assetServiceToServiceSubAccount = (
  authClient: string,
  serviceName: string,
  servicePrincipal: string,
  assetService: ServiceAsset,
  asset: Asset,
): ServiceSubAccount => {
  const princBytes = Principal.fromText(authClient).toUint8Array();
  const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
  return {
    serviceName: serviceName,
    servicePrincipal: servicePrincipal,
    assetLogo: asset.logo,
    assetSymbol: asset.symbol,
    assetTokenSymbol: asset.tokenSymbol,
    assetAddress: asset.address,
    assetDecimal: asset.decimal,
    assetShortDecimal: asset.shortDecimal,
    assetName: asset.name,
    subAccountId: princSubId,
    depositFee: assetService.depositFee,
    withdrawFee: assetService.withdrawFee,
  };
};
