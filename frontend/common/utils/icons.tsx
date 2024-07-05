import GenericTokenIcon from "@/assets/svg/files/generic-token.svg";
import { IconType, IconTypeEnum, symbolIconDict } from "@/common/const";
import store from "@redux/Store";

export const getAssetIcon = (type: IconType, symbol?: string, logo?: string) => {
  const sizeClass = getSizeClassByIconType(type);
  const iconSrc = getIconSrc(logo, symbol);

  return <img className={sizeClass} src={iconSrc} alt="" />;
};

const getSizeClassByIconType = (type: IconType): string => {
  switch (type) {
    case IconTypeEnum.Enum.FILTER:
      return "w-6 h-6";
    case IconTypeEnum.Enum.ASSET:
      return "w-8 h-8";
    case IconTypeEnum.Enum.ALLOWANCE:
      return "w-7 h-7";
    case IconTypeEnum.Enum.SELECT:
      return "w-5 h-5";
    default:
      return "w-10 h-10";
  }
};

export const getIconSrc = (logo?: string, symbol?: string): string => {
  if (logo && logo !== "") {
    return logo;
  } else if (symbol) {
    return symbolIconDict[symbol] || getLogoFromICRC(symbol) || GenericTokenIcon;
  } else {
    return GenericTokenIcon;
  }
};

const getLogoFromICRC = (symbol: string) => {
  const logo = store.getState().asset.utilData.icr1SystemAssets.find((asset) => asset.tokenSymbol === symbol)?.logo;
  return logo;
};
