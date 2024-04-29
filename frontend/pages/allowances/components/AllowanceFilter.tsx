import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { useState } from "react";
import AssetFilter from "./AssetFilter";
import { CustomInput } from "@components/input";
import { useTranslation } from "react-i18next";
import { IconButton } from "@components/button";

export default function AllowanceFilter() {
  const { t } = useTranslation();
  const [searchKey, setSearchKey] = useState("");
  const [assetSelectOpen, setAssetSelectOpen] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

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

        <IconButton icon={<PlusIcon className="w-6 h-6" />} size="medium" className="ml-2" onClick={() => {}} />
      </div>
    </div>
  );
}
