import SearchIcon from "@assets/svg/files/icon-search.svg";
import { IconButton } from "@components/button";
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
//
import { memo } from "react";
import AssetFilter from "@/pages/services/components/AssetFilter";
import { CustomInput } from "@components/input";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { useAppSelector } from "@redux/Store";

interface ServicesFiltersProps {
  onServiceKeyChange: (key: string) => void;
  assetFilter: string[];
  onAssetFilterChange: (assetFilter: string[]) => void;
  supportedAssetsActive: boolean;
  setSupportedAssetsActive: (assetFilter: boolean) => void;
  filterAssets: ServiceAsset[];
  setNewService(value: boolean): void;
}

function ServicesFilters(props: ServicesFiltersProps) {
  const {
    onServiceKeyChange,
    assetFilter,
    onAssetFilterChange,
    supportedAssetsActive,
    setSupportedAssetsActive,
    filterAssets,
    setNewService,
  } = props;

  const { watchOnlyMode } = useAppSelector((state) => state.auth);
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

      {!watchOnlyMode && (
        <IconButton icon={<PlusIcon className="w-6 h-6" />} size="medium" onClick={() => setNewService(true)} />
      )}
    </div>
  );
}

export default memo(ServicesFilters);
