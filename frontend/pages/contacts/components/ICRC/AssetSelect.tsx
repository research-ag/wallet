import SearchIcon from "@assets/svg/files/icon-search.svg";
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { CustomInput } from "@components/input";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
import clsx from "clsx";
import { useState } from "react";

const Trigger = (props: { open: boolean; selectedOption: Asset; options: Asset[]; onClick: () => void }) => {
  return (
    <div className="flex items-center justify-between w-[10rem] h-[1rem]" onClick={props.onClick}>
      {props.selectedOption.symbol ? (
        <div className="flex items-center">
          {getAssetIcon(IconTypeEnum.Enum.FILTER, props.selectedOption?.tokenSymbol, props.selectedOption?.logo)}
          <p className="ml-2 text-md">{props.selectedOption.symbol}</p>
        </div>
      ) : (
        <p className="text-md">Select Asset</p>
      )}
      {props.open ? <ChevronDownIcon /> : <ChevronLeftIcon />}
    </div>
  );
};

const Content = (props: { options: Asset[]; selectedOption: Asset; onSelectAsset: (asset: Asset) => void }) => {
  return (
    <div className="">
      <div className="p-1 bg-red-500">
        <CustomInput
          prefix={<img src={SearchIcon} className="mx-2 w-[1rem] h-[1rem]" alt="search-icon" />}
          onChange={handleSearchChange}
          placeholder="Search"
          className="dark:bg-SideColor bg-PrimaryColorLight h-[2rem]"
          inputClass="h-[1.8rem]"
        />
      </div>
      {props.options.map((option, index) => {
        const isLast = props.options.length - 1 === index;

        return (
          <DropdownMenu.Item
            key={option.address}
            className={clsx(
              "flex items-center justify-between p-1 h-[2.2rem] cursor-pointer hover:bg-primary-color hover:text-white",
              { "rounded-b-lg": isLast },
            )}
            onClick={() => props.onSelectAsset(option)}
          >
            {getAssetIcon(IconTypeEnum.Enum.FILTER, option?.tokenSymbol, option?.logo)}
            <p className="text-md">{option.symbol}</p>
          </DropdownMenu.Item>
        );
      })}
    </div>
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }
};

interface AssetSelectProps {
  onAssetChange: (tokenSymbol: string) => void;
  error: boolean;
  clearErrors: () => void;
}

export default function AssetSelect(props: AssetSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Asset>({
    sortIndex: 0,
    logo: "",
    name: "",
    symbol: "",
    address: "",
    decimal: "",
    shortDecimal: "",
    tokenName: "",
    tokenSymbol: "",
    subAccounts: [],
    supportedStandards: [],
  });

  const assets = useAppSelector((state) => state.asset.list.assets);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger className={triggerStyles(props.error)}>
        <Trigger open={open} options={assets} selectedOption={selectedOption} onClick={() => setOpen(!open)} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="rounded-lg w-[12rem] bg-PrimaryColorLight dark:bg-SecondaryColor text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          <Content options={assets} selectedOption={selectedOption} onSelectAsset={onSelectAsset} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function onSelectAsset(asset: Asset) {
    props.onAssetChange(asset.tokenSymbol);
    props.clearErrors();
    setSelectedOption(asset);
    setOpen(false);
  }
}

const triggerStyles = (error: boolean) =>
  clsx("border rounded-md", error ? "border-slate-color-error" : "border-BorderColorLight dark:border-BorderColor");
