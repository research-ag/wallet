// svg
import { ReactComponent as ServiceIcon } from "@assets/svg/files/service-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { AvatarEmpty } from "@components/avatar";
import { CustomInput } from "@components/input";
import { Principal } from "@dfinity/principal";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { Service } from "@redux/models/ServiceModels";
import { setReceiverServiceAction } from "@redux/transaction/TransactionActions";
import { Buffer } from "buffer";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
interface ReceiverServiceSelectorProps {
  contactsExist: boolean;
}

export const ReceiverServiceSelector = (props: ReceiverServiceSelectorProps) => {
  const { contactsExist } = props;
  const { t } = useTranslation();
  const { services } = useAppSelector((state) => state.services);
  const { sender } = useAppSelector((state) => state.transaction);
  const { authClient } = useAppSelector((state) => state.auth);
  const [searchKey, setSearchKey] = useState("");
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-0 m-0">
          <ServiceIcon className="cursor-pointer !fill-SelectRowColor" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] ${
            contactsExist ? "-right-20" : "-right-12"
          } mt-4 scroll-y-light rounded-lg shadow-sm`}
        >
          <div className="flex justify-center items-center w-full px-2 py-2">
            <CustomInput
              sizeComp={"medium"}
              sizeInput="medium"
              value={searchKey}
              onChange={onSearchChange}
              autoFocus
              placeholder={t("search")}
              prefix={<img src={SearchIcon} className="w-5 h-5 mx-2" alt="search-icon" />}
              compInClass="bg-white dark:bg-SecondaryColor"
            />
          </div>
          {services
            .filter((srv) => {
              const key = searchKey.trim().toLowerCase();
              const searchValid =
                key === "" || srv.name.toLowerCase().includes(key) || srv.principal.toLowerCase().includes(key);
              return !!srv.assets.find((ast) => ast.principal === sender.asset.address) && searchValid;
            })
            .map((srv, index) => {
              const { name, principal } = srv;
              return (
                <div
                  className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-primary-color"
                  key={`${principal}-${index}`}
                  onClick={() => onSelectService(srv)}
                >
                  <div className="flex items-center justify-between mr-2">
                    <AvatarEmpty title={name} size="large" />
                    <div className="ml-2">
                      <p className="text-left text-md text-black-color dark:text-white">{name}</p>
                      <p className="text-left opacity-50 text-md text-black-color dark:text-white">{srv.principal}</p>
                    </div>
                  </div>
                </div>
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
    const asst = srv.assets.find((ast) => ast.principal === sender.asset.address);
    if (asst) {
      setReceiverServiceAction({
        serviceName: srv.name,
        servicePrincipal: srv.principal,
        assetLogo: sender.asset.logo,
        assetSymbol: sender.asset.symbol,
        assetTokenSymbol: sender.asset.tokenSymbol,
        assetAddress: sender.asset.address,
        assetDecimal: sender.asset.decimal,
        assetShortDecimal: sender.asset.shortDecimal,
        assetName: sender.asset.name,
        subAccountId: princSubId,
        minDeposit: asst.minDeposit,
        minWithdraw: asst.minWithdraw,
        depositFee: asst.depositFee,
        withdrawFee: asst.withdrawFee,
      });
    }
  }
};
