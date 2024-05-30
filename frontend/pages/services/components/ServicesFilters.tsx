import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { memo } from "react";
import AddServiceModal from "./AddServiceModal";
import AssetFilter from "./AssetFilter";
import { CustomInput } from "@components/input";
import { ServiceAsset } from "@redux/models/ServiceModels";

interface ServicesFiltersProps {
  onServiceKeyChange: (key: string) => void;
  assetFilter: string[];
  onAssetFilterChange: (assetFilter: string[]) => void;
  supportedAssetsActive: boolean;
  setSupportedAssetsActive: (assetFilter: boolean) => void;
  filterAssets: ServiceAsset[];
}

function ServicesFilters(props: ServicesFiltersProps) {
  const {
    onServiceKeyChange,
    assetFilter,
    onAssetFilterChange,
    supportedAssetsActive,
    setSupportedAssetsActive,
    filterAssets,
  } = props;
  return (
    <div className="flex items-center justify-start w-full gap-3">
      <AssetFilter
        onAssetFilterChange={onAssetFilterChange}
        assetFilter={assetFilter}
        supportedAssetsActive={supportedAssetsActive}
        setSupportedAssetsActive={setSupportedAssetsActive}
        filterAssets={filterAssets}
      />

      <CustomInput
        compOutClass="!w-[40%]"
        prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
        intent={"secondary"}
        sizeInput={"medium"}
        placeholder="Search by Name and Principal"
        onChange={(e) => onServiceKeyChange(e.target.value)}
      />

      <AddServiceModal />
    </div>
  );
}

export default memo(ServicesFilters);
