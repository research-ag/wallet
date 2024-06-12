// svg
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { Service } from "@redux/models/ServiceModels";
import { useState } from "react";
import { CustomInput } from "@components/input";
import { Service } from "@redux/models/ServiceModels";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
// import { useAppSelector } from "@redux/Store";

// TODO: complete service after get the feature details (SenderService)

export default function SenderServiceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const { setTransferState } = useTransfer();
  // const { services } = useAppSelector((state) => state.services);
  const princBytes = Principal.fromText(authClient).toUint8Array();
  const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

  return (
    <div className="max-w-[21rem] mx-auto">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger
          asChild
          className="flex flex-row items-center justify-between h-12 px-4 py-2 border rounded-md cursor-pointer bg-ThemeColorSelectorLight dark:bg-SecondaryColor border-BorderColorLight dark:border-BorderColor"
        >
          <div className="flex items-center justify-center w-full ">
            {/* <div className="flex items-center mr-2">
              {sender.serviceSubAccount.servicePrincipal ? (
                <div className="flex flex-row items-center justify-start gap-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                  <div className="flex items-center justify-center w-10 h-10 rounded dark:bg-gray-color-4 bg-gray-color-7">
                    <p className="">{sender.serviceSubAccount.serviceName[0] || ""}</p>
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-start text-md ">{sender.serviceSubAccount.serviceName}</p>
                    <p className="font-light text-start text-md">{sender.serviceSubAccount.servicePrincipal}</p>
                  </div>
                </div>
              ) : (
                <p className={"text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor"}>
                  {t("select.option")}
                </p>
              )}
            </div> */}
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
            {/* <div className="mt-2">
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
                    <div className="flex flex-row items-center justify-start gap-2 cursor-pointer text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                      <div className="flex items-center justify-center w-10 h-10 rounded dark:bg-gray-color-4 bg-gray-color-7">
                        <p className="">{option.name[0] || ""}</p>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-start text-md ">{option.name}</p>
                        <p className="font-light text-start text-md">{option.principal}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div> */}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );

  function handleSelectOption(opt: Service) {
    // const ast = opt.assets.find((asst) => asst.principal === sender.asset.address);
    // if (ast) {
    // setSenderServiceAction({
    //   serviceName: opt.name,
    //   servicePrincipal: opt.principal,
    //   assetLogo: sender.asset.logo,
    //   assetSymbol: sender.asset.symbol,
    //   assetTokenSymbol: sender.asset.tokenSymbol,
    //   assetAddress: sender.asset.address,
    //   assetDecimal: sender.asset.decimal,
    //   assetShortDecimal: sender.asset.shortDecimal,
    //   assetName: sender.asset.name,
    //   subAccountId: princSubId,
    //   minDeposit: ast.minDeposit,
    //   minWithdraw: ast.minWithdraw,
    //   depositFee: ast.depositFee,
    //   withdrawFee: ast.withdrawFee,
    // });
    // }

    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: princSubId,
      fromPrincipal: opt.principal,
    }));
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchKey(event.target.value);
  }
}
