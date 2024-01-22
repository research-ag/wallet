import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "./icons";
import { Asset } from "@redux/models/AccountModels";

export default function formatAsset(asset: Asset) {
  return {
    value: asset?.tokenName,
    label: `${asset?.tokenName} / ${asset?.tokenSymbol}`,
    icon: getAssetIcon(IconTypeEnum.Enum.ASSET, asset?.tokenSymbol, asset?.logo),
  };
}
