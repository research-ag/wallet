import { IconTypeEnum } from "@/common/const";
import { getAssetIcon } from "@common/utils/icons";
import { Asset } from "@redux/models/AccountModels";

export default function formatAsset(asset: Asset) {
  return {
    value: asset?.tokenSymbol,
    label: `${asset?.name} / ${asset?.symbol}`,
    icon: getAssetIcon(IconTypeEnum.Enum.ASSET, asset?.tokenSymbol, asset?.logo),
  };
}
