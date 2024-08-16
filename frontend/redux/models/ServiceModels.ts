import { z } from "zod";

export const ServiceAssetDataSchema = z.object({
  tokenSymbol: z.string(),
  logo: z.string(),
  tokenName: z.string(),
  decimal: z.string(),
  shortDecimal: z.string(),
  principal: z.string(),
});

export type ServiceAssetData = z.infer<typeof ServiceAssetDataSchema>;

const ServiceDataSchema = z.object({
  name: z.string(),
  principal: z.string(),
  assets: z.array(ServiceAssetDataSchema),
});
export type ServiceData = z.infer<typeof ServiceDataSchema>;

export const ServiceAssetSchema = z.object({
  tokenSymbol: z.string(),
  tokenName: z.string(),
  decimal: z.string(),
  shortDecimal: z.string(),
  logo: z.string(),
  balance: z.string(),
  credit: z.string(),
  // minDeposit: z.string(),
  // minWithdraw: z.string(),
  depositFee: z.string(),
  withdrawFee: z.string(),
  principal: z.string(),
  visible: z.boolean(),
});

export type ServiceAsset = z.infer<typeof ServiceAssetSchema>;

export const ServiceSchema = z.object({
  name: z.string(),
  principal: z.string(),
  assets: z.array(ServiceAssetSchema),
});

export type Service = z.infer<typeof ServiceSchema>;
