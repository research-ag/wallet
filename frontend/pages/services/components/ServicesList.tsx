// svgs
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as MoreIcon } from "@assets/svg/files/more-alt.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { shortAddress } from "@common/utils/icrc";
import { getInitialFromName } from "@common/utils/strings";
import { CustomInput } from "@components/input";
import { CustomCopy } from "@components/tooltip";
import { Service } from "@redux/models/ServiceModels";
import { clsx } from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import useServicesList from "../hooks/useServiceList";
import ServiceAssetsList from "./ServiceAssetsList";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DeleteServiceModal } from "./Modals/deleteService";

interface ServicesListProps {
  services: Service[];
}

export default function ServicesList({ services }: ServicesListProps) {
  const { t } = useTranslation();
  const {
    selectedService,
    openService,
    editedService,
    editedServiceErr,
    onContactNameChange,
    onChevIconClic,
    onEditService,
    onClose,
    onSave,
    onDeleteService,
  } = useServicesList();
  const [openMore, setOpenMore] = useState(-1);
  const [deleteService, setDeleteService] = useState<Service>();

  return (
    <Fragment>
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md mt-2">
        <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 z-[1]">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[30%] bg-PrimaryColorLight dark:bg-PrimaryColor ">
              <p>{t("name")}</p>
            </th>
            <th className="p-2 text-left w-[55%] bg-PrimaryColorLight dark:bg-PrimaryColor">
              <p>{"Principal"}</p>
            </th>
            <th className="p-2 w-[12%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
            <th className="w-[3%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
          </tr>
        </thead>
        <tbody>
          {services.map((srv, k) => {
            return (
              <Fragment key={k}>
                <tr className={ServiceStyle(srv)}>
                  <td
                    onDoubleClick={() => {
                      onEditService(srv);
                    }}
                  >
                    <div className="relative flex flex-row items-center justify-start w-full gap-2 px-4 min-h-14">
                      {srv.principal === selectedService && (
                        <div className="absolute left-0 w-1 h-14 bg-SelectRowColor"></div>
                      )}
                      {srv.principal === selectedService && editedService ? (
                        <CustomInput
                          intent={"primary"}
                          border={editedServiceErr.name ? "error" : "selected"}
                          sizeComp={"xLarge"}
                          sizeInput="small"
                          value={editedService.name}
                          onChange={onContactNameChange}
                          sufix={
                            <div className="flex flex-row justify-start items-center">
                              <CheckIcon
                                onClick={onSave}
                                className="w-4 h-4 opacity-50 cursor-pointer stroke-slate-color-success"
                              />
                              <CloseIcon
                                onClick={onClose}
                                className="w-5 h-5 opacity-50 cursor-pointer stroke-slate-color-error"
                              />
                            </div>
                          }
                        />
                      ) : (
                        <div className="flex flex-row items-center justify-start w-full gap-2">
                          <div
                            className={`flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md ${getContactColor(
                              k,
                            )}`}
                          >
                            <p className="text-PrimaryTextColor">{getInitialFromName(srv.name, 2)}</p>
                          </div>
                          <p className="text-left opacity-70 break-words max-w-[14rem]">{srv.name}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row items-center justify-start gap-2 px-2 opacity-70">
                      <p>{shortAddress(srv.principal, 12, 9)}</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={srv.principal} />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="relative flex items-center justify-center h-full">
                      <DropdownMenu.Root
                        open={openMore === k}
                        onOpenChange={(e) => {
                          onOpenMoreChange(k, e);
                        }}
                      >
                        <DropdownMenu.Trigger>
                          <MoreIcon className="cursor-pointer fill-PrimaryTextColorLight/70 dark:fill-PrimaryTextColor/70" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className=" w-[6rem] rounded-md bg-DeleteBackgroundColor !z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor dark:border dark:border-BorderColorTwo shadow-md shadow-PrimaryColor/30 dark:shadow-black/20"
                            sideOffset={5}
                            align="end"
                          >
                            <div
                              className="flex flex-row items-center justify-center gap-2 p-2 cursor-pointer hover:bg-TextErrorColor/20 rounded-b-md"
                              onClick={() => {
                                onDelete(srv);
                              }}
                            >
                              <TrashIcon className="w-4 h-4 cursor-pointer fill-TextErrorColor" />
                              <p className="text-TextErrorColor">{t("delete")}</p>
                            </div>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row items-start justify-center w-full gap-2">
                      <ChevIcon
                        onClick={() => {
                          onChevIconClic(srv);
                        }}
                        className={`w-8 h-8 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor stroke-0  cursor-pointer ${
                          srv.principal === openService ? "" : "rotate-90"
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {srv.principal === openService && (
                  <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
                    <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
                      <ServiceAssetsList servicePrincipal={srv.principal} service={srv} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {deleteService && (
        <DeleteServiceModal
          open={!!deleteService}
          setOpen={onDeleteServiceChange}
          service={deleteService}
          removeService={onDeleteService}
        />
      )}
    </Fragment>
  );

  function ServiceStyle(srv: Service) {
    return clsx({
      ["border-b border-BorderColorTwoLight dark:border-BorderColorTwo"]: true,
      ["bg-SelectRowColor/10"]: srv.principal === selectedService,
      ["bg-SecondaryColorLight dark:bg-SecondaryColor"]:
        srv.principal !== selectedService && srv.principal === openService,
    });
  }
  function getContactColor(idx: number) {
    if (idx % 3 === 0) return "bg-ContactColor1";
    else if (idx % 3 === 1) return "bg-ContactColor2";
    else return "bg-ContactColor3";
  }
  function onOpenMoreChange(k: number, e: boolean) {
    setOpenMore(e ? k : -1);
  }
  function onDelete(srv: Service) {
    setDeleteService(srv);
  }
  function onDeleteServiceChange(value: boolean) {
    if (!value) setDeleteService(undefined);
  }
}
