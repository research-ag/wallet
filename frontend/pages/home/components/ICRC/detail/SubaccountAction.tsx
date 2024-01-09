// svgs
import ArrowBottomLeftIcon from "@assets/svg/files/arrow-bottom-left-icon.svg";
import ArrowTopRightIcon from "@assets/svg/files/arrow-top-right-icon.svg";
// import WrapIcon from "@assets/svg/files/wrap-icon.svg";
//
import { DrawerOption, DrawerOptionEnum, IconTypeEnum } from "@/const";
import { toFullDecimal } from "@/utils";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";
interface ICRCSubaccountActionProps {
  onActionClick(value: DrawerOption): void;
}

const ICRCSubaccountAction: FC<ICRCSubaccountActionProps> = ({ onActionClick }) => {
  const { getAssetIcon, selectedAsset, selectedAccount } = GeneralHook();
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className="flex flex-col justify-center items-start bg-SelectRowColor w-[17rem] h-full rounded-l-md p-4 text-[#ffff]">
        <div className="flex flex-row justify-between items-center gap-1 w-full">
          {getAssetIcon(IconTypeEnum.Enum.HEADER, selectedAsset?.tokenSymbol, selectedAsset?.logo)}
          <div className="flex flex-col justify-center items-end">
            <p className="font-semibold text-[1.15rem] text-right">{`${toFullDecimal(
              selectedAccount?.amount || "0",
              selectedAccount?.decimal || 8,
              Number(selectedAsset?.shortDecimal),
            )} ${selectedAsset?.symbol || ""}`}</p>
            <p className="font-semibold text-md">{`$${selectedAccount?.currency_amount || ""}`}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-around items-center h-full w-[calc(100%-17rem)] text-ThirdTextColorLight dark:text-ThirdTextColor">
        <div className="flex flex-col justify-center items-center w-1/3 gap-1">
          <div
            className="flex flex-row justify-center items-center w-7 h-7 bg-SelectRowColor rounded-md cursor-pointer"
            onClick={() => {
              onActionClick(DrawerOptionEnum.Enum.SEND);
            }}
          >
            <img src={ArrowTopRightIcon} className="w-3 h-3" alt="send-icon" />
          </div>
          <p className="text-md">{t("send")}</p>
        </div>
        <div className="flex flex-col justify-center items-center w-1/3 gap-1">
          <div
            className="flex flex-row justify-center items-center w-7 h-7 bg-SelectRowColor rounded-md cursor-pointer"
            onClick={() => {
              onActionClick(DrawerOptionEnum.Enum.RECEIVE);
            }}
          >
            <img src={ArrowBottomLeftIcon} className="w-3 h-3" alt="receive-icon" />
          </div>
          <p className="text-md">{t("receive")}</p>
        </div>
      </div>
    </Fragment>
  );
};

export default ICRCSubaccountAction;
