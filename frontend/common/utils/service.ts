import { ServiceAsset, ServiceAssetData } from "@redux/models/ServiceModels";

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
