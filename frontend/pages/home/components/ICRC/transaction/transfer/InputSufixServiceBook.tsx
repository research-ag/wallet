// svg
import { ReactComponent as ServiceIcon } from "@assets/svg/files/service-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { AvatarEmpty } from "@components/avatar";
import { TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { Service } from "@redux/models/ServiceModels";
import { Principal } from "@dfinity/principal";
import { Buffer } from "buffer";
import { CustomInput } from "@components/input";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

interface InputSufixServiceBookProps {
  hasContacts: boolean;
}

export default function InputSufixServiceBook(props: InputSufixServiceBookProps) {
  const { hasContacts } = props;
  const { t } = useTranslation();
  const { services } = useAppSelector((state) => state.services);
  const { authClient } = useAppSelector((state) => state.auth);
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { transferState, setTransferState } = useTransfer();
  const [searchKey, setSearchKey] = useState("");
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-0 m-0">
          <ServiceIcon className="cursor-pointer !fill-SelectRowColor" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={clsx(
            "absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] mt-4 scroll-y-light rounded-lg  shadow-sm",
            {
              "-right-[5rem]": hasContacts,
              "-right-[3rem]": !hasContacts,
            },
          )}
        >
          <div className="flex items-center justify-center w-full px-2 py-2">
            <CustomInput
              sizeComp={"medium"}
              sizeInput="medium"
              value={searchKey}
              onChange={onSearchChange}
              autoFocus
              placeholder={t("search")}
              prefix={<img src={SearchIcon} className="w-5 h-5 mx-2" alt="search-icon" />}
              compInClass="bg-white dark:bg-SecondaryColor"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          {services
            .filter((srv) => {
              const key = searchKey.trim().toLowerCase();
              const isServiceNameIncluded = srv.name.toLowerCase().includes(key);
              const isServicePrincipalIncluded = srv.principal.toLowerCase().includes(key);

              let isSameAsset = false;

              if (currentAsset) {
                isSameAsset = !!srv.assets.find((asset) => asset.principal === currentAsset.address && asset.visible);
              }

              return isSameAsset && (key === "" || isServiceNameIncluded || isServicePrincipalIncluded);
            })
            .map((srv, index) => {
              const { name, principal } = srv;
              return (
                <DropdownMenu.Item
                  className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-primary-color"
                  key={`${principal}-${index}`}
                  onSelect={() => onSelectService(srv)}
                >
                  <div className="flex items-center justify-between mr-2">
                    <AvatarEmpty title={name} size="large" />
                    <div className="ml-2">
                      <p className="text-left text-md text-black-color dark:text-white">{name}</p>
                      <p className="text-left opacity-50 text-md text-black-color dark:text-white">{srv.principal}</p>
                    </div>
                  </div>
                </DropdownMenu.Item>
              );
            })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchKey(e.target.value);
  }

  function onSelectService(srv: Service) {
    const princBytes = Principal.fromText(authClient).toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

    setTransferState((prev) => ({
      ...prev,
      toPrincipal: srv.principal,
      toSubAccount: princSubId,
      toType: TransferToTypeEnum.thirdPartyService,
    }));
  }
}
