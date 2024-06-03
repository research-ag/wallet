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
import { setSenderServiceAction } from "@redux/transaction/TransactionActions";
import { Principal } from "@dfinity/principal";

export default function SenderService() {
  const { t } = useTranslation();
  const { sender } = useAppSelector((state) => state.transaction);
  const { services } = useAppSelector((state) => state.services);
  const { authClient } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Service>();
  const [searchKey, setSearchKey] = useState<string>("");
  const princBytes = Principal.fromText(authClient).toUint8Array();
  const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

  return (
    <div className="mx-4">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger
          asChild
          className="flex flex-row justify-between items-center bg-ThemeColorSelectorLight dark:bg-SecondaryColor border rounded-md border-BorderColorLight dark:border-BorderColor py-2 px-4 h-12 cursor-pointer"
        >
          <div className="flex items-center justify-center w-full ">
            <div className="flex items-center mr-2">
              {selectedValue && (
                <div className="flex flex-row justify-start items-center gap-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                  <div className="flex justify-center items-center w-10 h-10 rounded dark:bg-gray-color-4 bg-gray-color-7">
                    <p className="">{selectedValue.name[0] || ""}</p>
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-start text-md ">{selectedValue.name}</p>
                    <p className="text-start text-md font-light">{selectedValue.principal}</p>
                  </div>
                </div>
              )}
              {!selectedValue && (
                <p className={"text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor"}>
                  {t("select.option")}
                </p>
              )}
            </div>
            <DropIcon className={`fill-gray-color-4 ${isOpen ? "-rotate-90" : ""}`} />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-ThemeColorSelectorLight dark:bg-ThemeColorBack rounded-md border border-RadioCheckColor scroll-y-light z-[9999] w-[21rem] p-2">
            <CustomInput
              value={searchKey}
              prefix={<img src={SearchIcon} className="mx-2 w-[1.2rem] h-[1rem]" alt="search-icon" />}
              onChange={handleSearchChange}
              placeholder="Search"
              className="dark:bg-SideColor bg-PrimaryColorLight h-[2.5rem]"
              inputClass="h-[2rem]"
            />
            <div className="mt-2">
              {services
                .filter((option) => {
                  return !!option.assets.find((ast) => ast.principal === sender.asset.address);
                })
                .map((option, index) => (
                  <div
                    onClick={() => {
                      handleSelectOption(option);
                      setIsOpen(false);
                    }}
                    key={index}
                  >
                    <div className="flex flex-row justify-start items-center gap-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor cursor-pointer">
                      <div className="flex justify-center items-center w-10 h-10 rounded dark:bg-gray-color-4 bg-gray-color-7">
                        <p className="">{option.name[0] || ""}</p>
                      </div>
                      <div className="flex flex-col justify-center items-start">
                        <p className="text-start text-md ">{option.name}</p>
                        <p className="text-start text-md font-light">{option.principal}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );

  function handleSelectOption(opt: Service) {
    const ast = opt.assets.find((asst) => asst.principal === sender.asset.address);
    if (ast) {
      setSelectedValue(opt);
      setSenderServiceAction({
        serviceName: opt.name,
        servicePrincipal: opt.principal,
        assetLogo: sender.asset.logo,
        assetSymbol: sender.asset.symbol,
        assetTokenSymbol: sender.asset.tokenSymbol,
        assetAddress: sender.asset.address,
        assetDecimal: sender.asset.decimal,
        assetShortDecimal: sender.asset.shortDecimal,
        assetName: sender.asset.name,
        subAccountId: princSubId,
        minDeposit: ast.minDeposit,
        minWithdraw: ast.minWithdraw,
        depositFee: ast.depositFee,
        withdrawFee: ast.withdrawFee,
      });
    }
  }
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchKey(event.target.value);
  }
}
