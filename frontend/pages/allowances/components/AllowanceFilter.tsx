import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { Dispatch, SetStateAction, useState } from "react";
import AssetFilter from "./AssetFilter";
import { CustomInput } from "@components/input";
import { useTranslation } from "react-i18next";
import { IconButton } from "@components/button";
import useAllowanceDrawer from "../hooks/useAllowanceDrawer";
import { useAppSelector } from "@redux/Store";

interface AllowanceFilterProps {
  searchKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
  selectedAssets: string[];
  setSelectedAssets: Dispatch<SetStateAction<string[]>>;
}

export default function AllowanceFilter(props: AllowanceFilterProps) {
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { searchKey, setSearchKey, selectedAssets, setSelectedAssets } = props;
  const { t } = useTranslation();
  const { onOpenCreateAllowanceDrawer } = useAllowanceDrawer();
  const [assetSelectOpen, setAssetSelectOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-2/3 ">
      <div className="flex items-center justify-center w-1/3">
        <p className="mr-4 text-md">Asset</p>
        <AssetFilter
          assetSelectOpen={assetSelectOpen}
          setAssetSelectOpen={setAssetSelectOpen}
          selectedAssets={selectedAssets}
          setSelectedAssets={setSelectedAssets}
        />
      </div>

      <div className="flex w-2/3">
        <CustomInput
          prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
          intent={"secondary"}
          sizeInput={"medium"}
          placeholder={t("allowance.search")}
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
        />

        {!watchOnlyMode && (
          <IconButton
            icon={<PlusIcon className="w-6 h-6" />}
            size="medium"
            className="ml-2"
            onClick={onOpenCreateAllowanceDrawer}
          />
        )}
      </div>
    </div>
  );
}
