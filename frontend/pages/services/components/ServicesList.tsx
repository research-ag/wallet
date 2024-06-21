// svgs
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as MoreIcon } from "@assets/svg/files/more-alt.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { TrashIcon } from "@radix-ui/react-icons";
//
import { shortAddress } from "@common/utils/icrc";
import { getInitialFromName } from "@common/utils/strings";
import { CustomInput } from "@components/input";
import { CustomCopy } from "@components/tooltip";
import { Service } from "@redux/models/ServiceModels";
import { clsx } from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import useServicesList from "@/pages/services/hooks/useServiceList";
import ServiceAssetsList from "@/pages/services/components/ServiceAssetsList";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DeleteServiceModal } from "@/pages/services/components/Modals/deleteService";
import { NewServiceRow } from "@/pages/services/components/NewServiceRow";
import { useAppSelector } from "@redux/Store";
import { CustomButton } from "@components/button";

interface ServicesListProps {
  services: Service[];
  newService: boolean;
  setNewService(value: boolean): void;
}

export default function ServicesList({ services, newService, setNewService }: ServicesListProps) {
  const { t } = useTranslation();
  const {
    selectedService,
    openService,
    editedService,
    editedServiceErr,
    addService,
    setAddService,
    onContactNameChange,
    onChevIconClic,
    onEditService,
    onClose,
    onSave,
    onDeleteService,
  } = useServicesList(newService);
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const [openMore, setOpenMore] = useState(-1);
  const [deleteService, setDeleteService] = useState<Service>();

  return (
    <Fragment>
      <table className="w-full mt-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 z-[1]">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[35%] bg-PrimaryColorLight dark:bg-PrimaryColor ">
              <p>{t("name")}</p>
            </th>
            <th className="p-2 text-left w-[55%] bg-PrimaryColorLight dark:bg-PrimaryColor">
              <p>{"Principal"}</p>
            </th>
            <th className="p-2 w-[5%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
            <th className="w-[5%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
          </tr>
        </thead>
        <tbody>
          {addService && <NewServiceRow setAddService={setAddService} setNewService={setNewService} />}
          {services.map((srv, k) => {
            return (
              <Fragment key={k}>
                <tr className={ServiceStyle(srv)}>
                  <td
                    onDoubleClick={() => {
                      !watchOnlyMode && onEditService(srv);
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
                            <div className="flex flex-row items-center justify-start">
                              <CheckIcon
                                onClick={onSave}
                                className="w-4 h-4 cursor-pointer opacity-80 dark:stroke-secondary-color-1-light stroke-secondary-color-2"
                              />
                              <CloseIcon
                                onClick={onClose}
                                className="w-5 h-5 cursor-pointer opacity-80 dark:stroke-secondary-color-1-light stroke-secondary-color-2"
                              />
                            </div>
                          }
                          className="w-[18rem]"
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
                      {!watchOnlyMode && (
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
                                  setNewService(false);
                                  setAddService(false);
                                  setOpenMore(-1);
                                  onDelete(srv);
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
                      )}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row items-start justify-center w-full gap-2">
                      <ChevIcon
                        onClick={() => {
                          onChevIconClic(srv);
                          setNewService(false);
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
                      <ServiceAssetsList service={srv} />
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
