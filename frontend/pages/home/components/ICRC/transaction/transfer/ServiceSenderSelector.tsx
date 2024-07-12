// svg
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
//
import { useAppSelector } from "@redux/Store";
import { Buffer } from "buffer";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Service } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import { CustomInput } from "@components/input";
import { Principal } from "@dfinity/principal";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import logger from "@/common/utils/logger";
import { AvatarEmpty } from "@components/avatar";
import { toFullDecimal } from "@common/utils/amount";

export default function SenderServiceSelector() {
  const { t } = useTranslation();
  const { transferState, setTransferState } = useTransfer();
  const { services } = useAppSelector((state) => state.services);
  const { authClient } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [usedAmount, setUsedAmount] = useState("");
  const [searchKey, setSearchKey] = useState<string>("");
  const assets = useAppSelector((state) => state.asset.list.assets);

  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  const princBytes = Principal.fromText(authClient).toUint8Array();
  const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

  return (
    <div className="mx-4">
      <DropdownMenu.Root open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger
          asChild
          className={`flex flex-row items-center justify-between ${
            transferState.fromPrincipal ? "h-16" : "h-12"
          } px-4 py-2 border rounded-md cursor-pointer bg-ThemeColorSelectorLight dark:bg-SecondaryColor border-BorderColorLight dark:border-BorderColor`}
        >
          <div className="flex items-center justify-center w-full ">
            <div className="flex items-center mr-2">
              {transferState.fromPrincipal ? (
                <div className="flex flex-row items-center justify-start gap-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                  <AvatarEmpty
                    title={getServiceName(transferState.fromPrincipal)}
                    size="medium"
                    className="mr-4 text-PrimaryTextColor"
                  />
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-start text-md ">{getServiceName(transferState.fromPrincipal)}</p>
                    <p className="font-light text-start text-md">{transferState.fromPrincipal}</p>
                    <p className="font-light text-start text-md opacity-50">{usedAmount}</p>
                  </div>
                </div>
              ) : (
                <p className={"text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor"}>
                  {t("select.option")}
                </p>
              )}
            </div>
            <DropIcon className={`fill-gray-color-4 ${isOpen ? "-rotate-90" : ""}`} />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-ThemeColorSelectorLight dark:bg-ThemeColorBack rounded-md border border-RadioCheckColor scroll-y-light z-[9999] w-[21rem]"
            sideOffset={2}
          >
            <CustomInput
              value={searchKey}
              prefix={<img src={SearchIcon} className="mx-2 w-[1.2rem] h-[1rem]" alt="search-icon" />}
              onChange={handleSearchChange}
              placeholder="Search"
              className="dark:bg-SideColor bg-PrimaryColorLight h-[2.5rem] mx-2 mt-2"
              inputClass="h-[2rem]"
            />
            <div className="mt-2">
              {services
                .filter((option) => {
                  const key = searchKey.trim().toLowerCase();
                  const isSearchKeyIncluded =
                    key === "" ||
                    option.name.toLowerCase().includes(key) ||
                    option.principal.toLowerCase().includes(key);

                  const isSelected = option.principal === transferState.fromPrincipal;

                  return (
                    option.assets.find((ast) => ast.principal === currentAsset?.address && ast.visible) &&
                    isSearchKeyIncluded &&
                    !isSelected
                  );
                })
                .map((option, index) => {
                  const usedAsset = option.assets.find((ast) => ast.principal === currentAsset?.address && ast.visible);
                  const amount = `${toFullDecimal(usedAsset?.credit || "0", Number(currentAsset?.decimal || "8"))} ${
                    currentAsset?.symbol || ""
                  }`;
                  return (
                    <div
                      onClick={() => {
                        handleSelectOption(option, amount);
                        setIsOpen(false);
                      }}
                      key={index}
                    >
                      <div className="flex flex-row items-center justify-start gap-2 px-2 py-2 cursor-pointer text-PrimaryTextColorLight dark:text-PrimaryTextColor hover:bg-RadioCheckColor">
                        <AvatarEmpty title={option.name} size="medium" className="mr-4 text-PrimaryTextColor" />
                        <div className="flex flex-col items-start justify-center">
                          <p className="text-start text-md ">{option.name}</p>
                          <p className="font-light text-start text-md">{option.principal}</p>
                          {usedAsset && currentAsset && (
                            <p className=" opacity-50 font-light text-start text-md">{amount}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );

  function handleSelectOption(opt: Service, amount: string) {
    setTransferState((prev) => ({
      ...prev,
      fromPrincipal: opt.principal,
      fromSubAccount: princSubId,
    }));
    setUsedAmount(amount);
  }

  function getServiceName(principal: string) {
    const service = services.find((srv) => srv.principal === principal);
    if (!service) logger.debug("getServiceName: service not found");
    return service?.name || "";
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchKey(event.target.value);
  }

  function onOpenChange(open: boolean) {
    setIsOpen(open);
    setSearchKey("");
  }
}
