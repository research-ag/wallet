import { z } from "zod";

const ServiceDataSchema = z.object({
  name: z.string(),
  principal: z.string(),
});
export type ServiceData = z.infer<typeof ServiceDataSchema>;

export const ServiceAssetSchema = z.object({
  tokenSymbol: z.string(),
  balance: z.string(),
  credit: z.string(),
  minDeposit: z.string(),
  minWithdraw: z.string(),
  depositFee: z.string(),
  withdrawFee: z.string(),
});

export type ServiceAsset = z.infer<typeof ServiceAssetSchema>;

export const ServiceSchema = z.object({
  name: z.string(),
  principal: z.string(),
  assets: z.array(ServiceAssetSchema),
});

export type Service = z.infer<typeof ServiceSchema>;
