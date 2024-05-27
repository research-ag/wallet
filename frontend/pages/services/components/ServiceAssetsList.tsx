// svg
import { ReactComponent as DepositIcon } from "@assets/svg/files/deposit-icon.svg";
import { ReactComponent as WithdrawIcon } from "@assets/svg/files/withdraw-icon.svg";
import { ReactComponent as NotifyIcon } from "@assets/svg/files/notify-icon.svg";
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
//
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { Service } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import useServiceAsset from "../hooks/useServiceAsset";
import CustomHoverCard from "@components/HoverCard";
import { toFullDecimal } from "@common/utils/amount";

interface ServiceAssetsListProps {
  service: Service;
}

export default function ServiceAssetsList({ service }: ServiceAssetsListProps) {
  const { t } = useTranslation();
  const { getAssetFromUserAssets } = useServiceAsset();
  return (
    <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
      <thead>
        <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
          <th className="p-2 text-left w-[5%]"></th>
          <th className="p-2 text-left w-[10%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
            <p>{t("asset")}</p>
          </th>
          <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
            <p>{t("deposit")}</p>
          </th>
          <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
            <p>{t("credit")}</p>
          </th>
          <th className="p-2 text-left w-[21%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
            <div className="flex flex-col justify-center items-center">
              <p>{t("deposit")}</p>
              <p>{`${t("minimun")} | ${t("fee")}`}</p>
            </div>
          </th>
          <th className="p-2 w-[34%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal">
            <div className="flex flex-row justify-end items-center w-full">
              <button className="flex flex-row px-2 py-1 gap-1 justify-center items-center rounded-md bg-SelectRowColor">
                <PlusIcon className="w-4 h-4" />
                <p>{t("asset")}</p>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {service.assets.map((asst, k) => {
          const asset = getAssetFromUserAssets(asst.tokenSymbol);
          return (
            <tr key={k}>
              <td className="h-full">
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  <div className="w-1 h-1 bg-SelectRowColor"></div>
                  {k !== service.assets.length - 1 && (
                    <div
                      style={{ height: "3.25rem" }}
                      className="absolute top-0 w-1 ml-[-0.75px] left-1/2 border-l border-dotted border-SelectRowColor"
                    ></div>
                  )}
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                <div className="flex flex-row items-center justify-start w-full gap-4 px-2">
                  {getAssetIcon(IconTypeEnum.Enum.ASSET, asst.tokenSymbol, asset?.logo)}
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                <div className="flex flex-row justify-start items-center w-full">
                  <p>{`${toFullDecimal(
                    asst.balance,
                    Number(asset?.decimal || "8"),
                    Number(asset?.shortDecimal || "8"),
                  )} ${asset?.symbol || ""}`}</p>
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                <div className="flex flex-row justify-start items-center w-full">
                  <p>{`${toFullDecimal(
                    asst.credit,
                    Number(asset?.decimal || "8"),
                    Number(asset?.shortDecimal || "8"),
                  )} ${asset?.symbol || ""}`}</p>
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                <div className="flex flex-row justify-center items-center w-full">
                  <p>{`${toFullDecimal(
                    asst.minDeposit,
                    Number(asset?.decimal || "8"),
                    Number(asset?.shortDecimal || "8"),
                  )} ${asset?.symbol || ""} | ${asst.depositFee} ${asset?.symbol || ""}`}</p>
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                <div className="flex flex-row justify-around items-center w-full px-10">
                  <CustomHoverCard
                    arrowFill="fill-SelectRowColor"
                    side="top"
                    trigger={
                      <button className="flex w-10 h-10 justify-center items-center rounded-md bg-SelectRowColor p-0">
                        <DepositIcon />
                      </button>
                    }
                  >
                    <div className=" p-1 rounded-md border border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                      <p className="text-sm text-SelectRowColor">{t("deposit")}</p>
                    </div>
                  </CustomHoverCard>

                  <CustomHoverCard
                    arrowFill="fill-SelectRowColor"
                    side="top"
                    trigger={
                      <button className="flex w-10 h-10 justify-center items-center rounded-md bg-SelectRowColor p-0">
                        <WithdrawIcon />
                      </button>
                    }
                  >
                    <div className=" p-1 rounded-md border border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                      <p className="text-sm text-SelectRowColor">{t("withdraw")}</p>
                    </div>
                  </CustomHoverCard>
                  <CustomHoverCard
                    arrowFill="fill-SelectRowColor"
                    side="top"
                    trigger={
                      <button className="flex w-10 h-10 justify-center items-center rounded-md bg-SelectRowColor p-0">
                        <NotifyIcon />
                      </button>
                    }
                  >
                    <div className=" p-1 rounded-md border border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                      <p className="text-sm text-SelectRowColor">{t("notify")}</p>
                    </div>
                  </CustomHoverCard>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
