// svg
import { ReactComponent as DepositIcon } from "@assets/svg/files/deposit-icon.svg";
import { ReactComponent as WithdrawIcon } from "@assets/svg/files/withdraw-icon.svg";
import { ReactComponent as NotifyIcon } from "@assets/svg/files/notify-icon.svg";
import { ReactComponent as MoreIcon } from "@assets/svg/files/more-alt.svg";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { TrashIcon } from "@radix-ui/react-icons";
//
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { Service, ServiceAsset } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import CustomHoverCard from "@components/HoverCard";
import { toFullDecimal } from "@common/utils/amount";
import { AddServiceAsset } from "@/pages/services/components/AddServiceAsset";
import useServiceAsset from "@/pages/services/hooks/useServiceAsset";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Fragment, useState } from "react";
import { DeleteAssetServiceModal } from "@/pages/services/components/Modals/deleteAssetService";
import { NotifyAssetModal } from "@/pages/services/components/Modals/notifyAsset";
import { LoadingLoader } from "@components/loader";
import { assetServiceToServiceSubAccount } from "@common/utils/service";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { CustomButton } from "@components/button";
import AddAllowanceDrawer from "@pages/allowances/components/AddAllowanceDrawer";
import useAllowanceDrawer from "@pages/allowances/hooks/useAllowanceDrawer";

interface ServiceAssetsListProps {
  service: Service;
}

export default function ServiceAssetsList({ service }: ServiceAssetsListProps) {
  const { t } = useTranslation();
  const {
    getAssetFromUserAssets,
    assetsToAdd,
    setAssetsToAdd,
    addAssetsToService,
    deleteAssetsToService,
    notifyAsset,
    notifyRes,
    setNotifyRes,
    onDeposit,
    onWithdraw,
    addAssetsToWallet,
  } = useServiceAsset();
  const { authClient, watchOnlyMode } = useAppSelector((state) => state.auth);
  const [openMore, setOpenMore] = useState(-1);
  const [deleteAsset, setDeleteAsset] = useState<ServiceAsset>();
  const [assetToNotify, setAssetToNotify] = useState<ServiceAsset>();
  const [notifyLoading, setNotifyLoading] = useState(-1);
  const { onOpenCreateAllowanceDrawerFromService } = useAllowanceDrawer();

  return (
    <Fragment>
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
        <thead>
          <tr className="border-b text-PrimaryTextColorLight dark:text-PrimaryTextColor border-BorderColorTwoLight dark:border-BorderColorTwo ">
            <th className="p-2 text-left w-[5%]"></th>
            <th className="p-2 text-left w-[22%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <p>{t("asset")}</p>
            </th>
            <th className="p-2 text-left w-[18%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <p>{t("deposit")}</p>
            </th>
            <th className="p-2 text-left w-[18%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <p>{t("credit")}</p>
            </th>
            {/* <th className="p-2 text-left w-[18%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal opacity-60">
              <div className="flex flex-col items-center justify-center">
                <p>{t("deposit")}</p>
                <p>{`${t("minimun")} | ${t("fee")}`}</p>
              </div>
            </th> */}
            <th className="p-2 w-[27%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal"></th>
            <th className="p-2 w-[5%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal"></th>
            <th className="p-2 w-[5%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {service.assets
            .filter((asst) => asst.visible)
            .map((asst, k) => {
              const ast = getAssetFromUserAssets(asst.principal);
              return (
                <tr key={k}>
                  <td className="h-full">
                    <div className="relative flex flex-col items-center justify-center w-full h-full">
                      <div className="w-1 h-1 bg-SelectRowColor"></div>
                      {k !== service.assets.filter((asst) => asst.visible).length - 1 && (
                        <div
                          style={{ height: "3.25rem" }}
                          className="absolute top-0 w-1 ml-[-0.75px] left-1/2 border-l border-dotted border-SelectRowColor"
                        ></div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                    <div className="flex flex-row items-center justify-start w-full gap-4 px-2">
                      {getAssetIcon(
                        IconTypeEnum.Enum.ASSET,
                        ast?.tokenSymbol || asst.tokenSymbol,
                        ast?.logo || asst.logo,
                      )}
                      <p>{`${ast?.symbol || asst.tokenSymbol}`}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                    <div className="flex flex-row items-center justify-start w-full">
                      <p>{`${toFullDecimal(
                        asst.balance,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )}`}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                    <div className="flex flex-row items-center justify-start w-full">
                      <p>{`${toFullDecimal(
                        asst.credit,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )}`}</p>
                    </div>
                  </td>
                  {/* <td className="px-2 py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                    <div className="flex flex-row items-center justify-center w-full">
                      <p>{`${toFullDecimal(
                        asst.minDeposit,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )} | ${toFullDecimal(
                        asst.depositFee,
                        Number(asst.decimal || "8"),
                        Number(asst.shortDecimal || "8"),
                      )}`}</p>
                    </div>
                  </td> */}
                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                    {!watchOnlyMode && (
                      <div className="flex flex-row items-center justify-center w-full gap-2 px-10">
                        <CustomHoverCard
                          arrowFill="fill-SelectRowColor"
                          side="top"
                          trigger={
                            <button
                              onClick={() => {
                                onActionClic(ast, asst, true);
                              }}
                              className="flex items-center justify-center w-10 h-10 p-0 rounded-md bg-SelectRowColor"
                            >
                              <DepositIcon />
                            </button>
                          }
                        >
                          <div className="p-1 border rounded-md border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                            <p className="text-sm text-SelectRowColor">{t("deposit")}</p>
                          </div>
                        </CustomHoverCard>

                        <CustomHoverCard
                          arrowFill="fill-SelectRowColor"
                          side="top"
                          trigger={
                            <button
                              onClick={() => {
                                onActionClic(ast, asst, false);
                              }}
                              className="flex items-center justify-center w-10 h-10 p-0 rounded-md bg-SelectRowColor"
                            >
                              <WithdrawIcon />
                            </button>
                          }
                        >
                          <div className="p-1 border rounded-md border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                            <p className="text-sm text-SelectRowColor">{t("withdraw")}</p>
                          </div>
                        </CustomHoverCard>
                        <CustomHoverCard
                          arrowFill="fill-SelectRowColor"
                          side="top"
                          trigger={
                            <button
                              className="flex items-center justify-center w-10 h-10 p-0 rounded-md bg-SelectRowColor"
                              onClick={() => {
                                onNotify(asst.principal, asst, k);
                              }}
                            >
                              {notifyLoading === k ? <LoadingLoader /> : <NotifyIcon />}
                            </button>
                          }
                        >
                          <div className="p-1 border rounded-md border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                            <p className="text-sm text-SelectRowColor">{t("notify")}</p>
                          </div>
                        </CustomHoverCard>
                        <CustomHoverCard
                          arrowFill="fill-SelectRowColor"
                          side="top"
                          trigger={
                            <button
                              className="flex items-center justify-center w-10 h-10 p-0 rounded-md bg-SelectRowColor"
                              onClick={() => {
                                onAllowanceClic(ast, service.principal);
                              }}
                            >
                              <MoneyHandIcon className="fill-PrimaryColorLight" />
                            </button>
                          }
                        >
                          <div className="p-1 border rounded-md border-SelectRowColor bg-SecondaryColorLight dark:bg-SecondaryColor">
                            <p className="text-sm text-SelectRowColor">{t("Allowance")}</p>
                          </div>
                        </CustomHoverCard>
                      </div>
                    )}
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center w-full h-full">
                      <DropdownMenu.Root
                        open={openMore === k}
                        onOpenChange={(e) => {
                          onOpenMoreChange(k, e);
                        }}
                      >
                        <DropdownMenu.Trigger>
                          <MoreIcon className="w-5 h-5 cursor-pointer fill-PrimaryTextColorLight/70 dark:fill-PrimaryTextColor/70" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="flex flex-col p-1 rounded-md dark:bg-level-1-color bg-secondary-color-2-light"
                            sideOffset={5}
                            align="center"
                          >
                            <CustomButton
                              className="flex items-center p-0"
                              onClick={() => {
                                setDeleteAsset(asst);
                                setOpenMore(-1);
                              }}
                              size={"small"}
                              intent="error"
                            >
                              <TrashIcon className="w-5 h-5 mr-[0.2]" />
                              <p className="text-md">{t("delete")}</p>
                            </CustomButton>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          {!watchOnlyMode && service.assets.filter((ast) => !ast.visible).length > 0 && (
            <tr>
              <td></td>
              <td colSpan={7}>
                <div className="flex flex-row items-center justify-start py-2">
                  <AddServiceAsset
                    servicePrincipal={service.principal}
                    assets={service.assets.filter((ast) => !ast.visible)}
                    assetsToAdd={assetsToAdd}
                    setAssetsToAdd={setAssetsToAdd}
                    addAssetsToService={addAssetsToService}
                    addAssetsToWallet={addAssetsToWallet}
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
      {notifyRes && assetToNotify && (
        <NotifyAssetModal
          open={!!notifyRes}
          setOpen={onNotifyAssetChange}
          service={service}
          asset={assetToNotify}
          res={notifyRes}
        />
      )}
      <AddAllowanceDrawer />
    </Fragment>
  );
  function onOpenMoreChange(k: number, e: boolean) {
    setOpenMore(e ? k : -1);
  }
  function onDeleteServiceAssetChange(value: boolean) {
    if (!value) setDeleteAsset(undefined);
  }

  async function onNotify(asstPrincipal: string, asst: ServiceAsset, k: number) {
    if (notifyLoading === -1) {
      setNotifyLoading(k);
      const resNotify = (await notifyAsset(service.principal, asstPrincipal, true)) as any;
      setNotifyRes(resNotify);
      setAssetToNotify(asst);
      setNotifyLoading(-1);
    }
  }
  function onNotifyAssetChange(value: boolean) {
    if (!value) {
      setNotifyRes(undefined);
      setAssetToNotify(undefined);
    }
  }

  function onActionClic(ast: Asset | undefined, serviceAsset: ServiceAsset, isDeposit: boolean) {
    if (ast)
      if (isDeposit)
        onDeposit(
          ast,
          assetServiceToServiceSubAccount(authClient, service.name, service.principal, serviceAsset, ast!),
        );
      else
        onWithdraw(
          ast,
          assetServiceToServiceSubAccount(authClient, service.name, service.principal, serviceAsset, ast!),
        );
  }

  function onAllowanceClic(myAsset: Asset | undefined, spender: string) {
    if (myAsset) onOpenCreateAllowanceDrawerFromService(myAsset, spender);
  }
}
