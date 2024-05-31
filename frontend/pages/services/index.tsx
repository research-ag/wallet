import Menu from "@pages/components/Menu";
import ServicesFilters from "@/pages/services/components/ServicesFilters";
import ServicesList from "@/pages/services//components/ServicesList";
import { useCallback } from "react";
import useServices from "./hooks/useServices";

export default function Services() {
  const {
    serviceList,
    assetFilter,
    setAssetFilter,
    setServiceSearchKey,
    supportedAssetsActive,
    setSupportedAssetsActive,
    filterAssets,
    newService,
    setNewService,
  } = useServices();

  const onServiceKeyChange = useCallback((serviceSearchkey: string) => {
    setServiceSearchKey(serviceSearchkey);
  }, []);

  return (
    <div className="flex flex-col w-full pt-[1rem] px-[2.25rem]">
      <div className="flex flex-col justify-start items-start w-full">
        <Menu />
        <ServicesFilters
          onServiceKeyChange={onServiceKeyChange}
          assetFilter={assetFilter}
          onAssetFilterChange={onAssetFilterChange}
          supportedAssetsActive={supportedAssetsActive}
          setSupportedAssetsActive={setSupportedAssetsActive}
          filterAssets={filterAssets}
          setNewService={setNewService}
        />
      </div>

      <div className="flex flex-col items-start justify-start w-full h-full">
        <ServicesList services={serviceList} newService={newService} setNewService={setNewService} />
      </div>
    </div>
  );

  function onAssetFilterChange(assetFilter: string[]) {
    setAssetFilter(assetFilter);
  }
}
