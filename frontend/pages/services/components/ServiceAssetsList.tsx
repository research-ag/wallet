// svg
import { ReactComponent as DepositIcon } from "@assets/svg/files/deposit-icon.svg";
import { ReactComponent as WithdrawIcon } from "@assets/svg/files/withdraw-icon.svg";
import { ReactComponent as NotifyIcon } from "@assets/svg/files/notify-icon.svg";
import { ReactComponent as MoreIcon } from "@assets/svg/files/more-alt.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
//
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { Service, ServiceAsset } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import CustomHoverCard from "@components/HoverCard";
import { toFullDecimal } from "@common/utils/amount";
import { AddServiceAsset } from "./addServiceAsset";
import useServiceAsset from "../hooks/useServiceAsset";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Fragment, useState } from "react";
import { DeleteAssetServiceModal } from "./Modals/deleteAssetService";

interface ServiceAssetsListProps {
  servicePrincipal: string;
  service: Service;
}

export default function ServiceAssetsList({ service, servicePrincipal }: ServiceAssetsListProps) {
  const { t } = useTranslation();
  const { assetsToAdd, setAssetsToAdd, addAssetsToService, deleteAssetsToService } = useServiceAsset();
  const [openMore, setOpenMore] = useState(-1);
  const [deleteAsset, setDeleteAsset] = useState<ServiceAsset>();
  return (
    <Fragment>
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
        <thead>
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
            <th className="p-2 text-left w-[5%]"></th>
            <th className="p-2 text-left w-[17%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <p>{t("asset")}</p>
            </th>
            <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <p>{t("deposit")}</p>
            </th>
            <th className="p-2 text-left w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <p>{t("credit")}</p>
            </th>
            <th className="p-2 text-left w-[18%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <div className="flex flex-col justify-center items-center">
                <p>{t("deposit")}</p>
                <p>{`${t("minimun")} | ${t("fee")}`}</p>
              </div>
            </th>
            <th className="p-2 w-[30%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {service.assets
            .filter((asst) => asst.visible)
            .map((asst, k) => {
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
                      {getAssetIcon(IconTypeEnum.Enum.ASSET, asst.tokenSymbol, asst.logo)}
                      <p>{`${asst.tokenSymbol || ""}`}</p>
                    </div>
                  </td>
                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                    <div className="flex flex-row justify-start items-center w-full">
                      <p>{`${toFullDecimal(
                        asst.balance,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )}`}</p>
                    </div>
                  </td>
                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                    <div className="flex flex-row justify-start items-center w-full">
                      <p>{`${toFullDecimal(
                        asst.credit,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )}`}</p>
                    </div>
                  </td>
                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo px-2">
                    <div className="flex flex-row justify-center items-center w-full">
                      <p>{`${toFullDecimal(
                        asst.minDeposit,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )} | ${asst.depositFee}`}</p>
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
                      <DropdownMenu.Root
                        open={openMore === k}
                        onOpenChange={(e) => {
                          onOpenMoreChange(k, e);
                        }}
                      >
                        <DropdownMenu.Trigger className="p-0">
                          <MoreIcon className="cursor-pointer fill-PrimaryTextColorLight/70 dark:fill-PrimaryTextColor/70" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className=" w-[6rem] rounded-md bg-DeleteBackgroundColor !z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor dark:border dark:border-BorderColorTwo shadow-md shadow-PrimaryColor/30 dark:shadow-black/20"
                            sideOffset={5}
                            align="center"
                          >
                            <div
                              className="flex flex-row items-center justify-center gap-2 p-1 cursor-pointer hover:bg-TextErrorColor/20 rounded-b-md"
                              onClick={() => {
                                setDeleteAsset(asst);
                                setOpenMore(-1);
                              }}
                            >
                              <TrashIcon className="w-4 h-4 cursor-pointer fill-TextErrorColor" />
                              <p className="text-TextErrorColor text-md">{t("delete")}</p>
                            </div>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                </tr>
              );
            })}
          {service.assets.filter((ast) => !ast.visible).length > 0 && (
            <tr>
              <td></td>
              <td colSpan={5}>
                <div className="flex flex-row justify-start items-center py-2">
                  <AddServiceAsset
                    servicePrincipal={service.principal}
                    assets={service.assets.filter((ast) => !ast.visible)}
                    assetsToAdd={assetsToAdd}
                    setAssetsToAdd={setAssetsToAdd}
                    addAssetsToService={addAssetsToService}
                  />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {deleteAsset && (
        <DeleteAssetServiceModal
          open={!!deleteAsset}
          setOpen={onDeleteServiceAssetChange}
          service={service}
          asset={deleteAsset}
          removeAssetService={deleteAssetsToService}
        />
      )}
    </Fragment>
  );
  function onOpenMoreChange(k: number, e: boolean) {
    setOpenMore(e ? k : -1);
  }
  function onDeleteServiceAssetChange(value: boolean) {
    if (!value) setDeleteAsset(undefined);
  }
}
