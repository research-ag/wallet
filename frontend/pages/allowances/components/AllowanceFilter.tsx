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
import { cleanAlphanumeric } from "@/common/utils/strings";

interface AllowanceFilterProps {
  setSearchKey: Dispatch<SetStateAction<string>>;
  selectedAssets: string[];
  setSelectedAssets: Dispatch<SetStateAction<string[]>>;
}

export default function AllowanceFilter(props: AllowanceFilterProps) {
  const { t } = useTranslation();
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { setSearchKey, selectedAssets, setSelectedAssets } = props;
  const { onOpenCreateAllowanceDrawer } = useAllowanceDrawer();
  const [assetSelectOpen, setAssetSelectOpen] = useState(false);

  return (
    <div className="flex items-center justify-end w-2/5">
      <div className="flex items-center justify-center mr-4">
        <p className="mr-4 text-md dark:text-gray-color-9 text-black-color">{t("asset")}</p>
        <AssetFilter
          assetSelectOpen={assetSelectOpen}
          setAssetSelectOpen={setAssetSelectOpen}
          selectedAssets={selectedAssets}
          setSelectedAssets={setSelectedAssets}
        />
      </div>

      <div className="flex items-center justify-center w-full">
        <CustomInput
          prefix={<img src={SearchIcon} className="w-5 h-5 mx-2" alt="search-icon" />}
          intent={"secondary"}
          sizeInput={"small"}
          placeholder={t("allowance.search")}
          onChange={(e) => setSearchKey(cleanAlphanumeric(e.target.value))}
          className="w-60"
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
