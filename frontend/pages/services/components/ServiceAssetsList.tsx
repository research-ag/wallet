// svg
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
//
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { Service } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import useServiceAsset from "../hooks/useServiceAsset";

interface ServiceAssetsListProps {
  service: Service;
}

export default function ServiceAssetsList({ service }: ServiceAssetsListProps) {
  const { t } = useTranslation();
  const { getAssetFromUserAssets } = useServiceAsset();
  return (
    <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
      <thead>
        <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
          <th className="p-2 text-left w-[10%]"></th>
          <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
            <p>{t("asset")}</p>
          </th>
          <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
            <p>{t("deposit")}</p>
          </th>
          <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
            <p>{t("credit")}</p>
          </th>
          <th className="p-2 w-[36%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
            <p>{t("action")}</p>
          </th>
          <th className="p-2 w-[9%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo"></th>
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
                  <p>{asset?.symbol || ""}</p>
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                <div className="flex flex-row justify-start items-center w-full">
                  <p>123.31</p>
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                <div className="flex flex-row justify-start items-center w-full">
                  <p>345.55</p>
                </div>
              </td>
              <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                <div className="flex flex-row justify-around items-center w-full">
                  <div className="flex px-3 py-2 rounded-md bg-SelectRowColor">
                    <p>Deposit</p>
                  </div>
                  <div className="flex px-3 py-2 rounded-md bg-SelectRowColor">
                    <p>Withdraw</p>
                  </div>
                  <div className="flex px-3 py-2 rounded-md bg-SelectRowColor">
                    <p>Notify</p>
                  </div>
                </div>
              </td>
              <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo "}>
                <div className="flex flex-row items-start justify-center w-full gap-2">
                  <ChevIcon className="invisible" />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
