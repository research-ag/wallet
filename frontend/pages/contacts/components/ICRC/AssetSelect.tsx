import SearchIcon from "@assets/svg/files/icon-search.svg";
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { removeExtraSpaces } from "@common/utils/strings";
import { CustomInput } from "@components/input";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Trigger = (props: { open: boolean; selectedOption: Asset; options: Asset[]; onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full pl-2" onClick={props.onClick}>
      {props.selectedOption.symbol ? (
        <div className="flex items-center">
          {getAssetIcon(IconTypeEnum.Enum.FILTER, props.selectedOption?.tokenSymbol, props.selectedOption?.logo)}
          <p className="ml-2 text-md">{props.selectedOption.symbol}</p>
        </div>
      ) : (
        <p className="text-md">{t("adding.select")}</p>
      )}
      {props.open ? <ChevronDownIcon /> : <ChevronLeftIcon />}
    </div>
  );
};

const Content = (props: { options: Asset[]; selectedOption: Asset; onSelectAsset: (asset: Asset) => void }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="max-h-[10rem]  scroll-y-light">
      <div className="p-1 rounded-tl-lg dark:bg-level-1-color bg-gray-color-8">
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

        if (search.length > 0) {
          if (!option.symbol.toLowerCase().includes(search.toLowerCase())) {
            return null;
          }
        }

        return (
          <div
            key={option.address}
            className={clsx(
              "flex items-center justify-between py-1 px-2 h-[2.2rem] cursor-pointer hover:bg-primary-color hover:text-white",
              { "rounded-b-lg": isLast },
            )}
            onClick={() => props.onSelectAsset(option)}
          >
            {getAssetIcon(IconTypeEnum.Enum.FILTER, option?.tokenSymbol, option?.logo)}
            <p className="text-md">{option.symbol}</p>
          </div>
        );
      })}
    </div>
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(removeExtraSpaces(e.target.value));
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
        <DropdownMenu.Content
          className="rounded-lg w-[10rem] bg-PrimaryColorLight dark:bg-SecondaryColor text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-lg border border-primary-color"
          sideOffset={2}
        >
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
  clsx("border-[2px] p-0 rounded-md dark:bg-level-2-color bg-white w-full max-w-[10rem] px-[0.2rem] h-[2.2rem]", {
    "border-slate-color-error": error,
    "border-primary-color": !error,
  });
