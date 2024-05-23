import Menu from "@pages/components/Menu";
import ServicesFilters from "@/pages/services/components/ServicesFilters";
import ServicesList from "@/pages/services//components/ServicesList";
import { useCallback } from "react";
import useServices from "./hooks/useServices";

export default function Services() {
  const { serviceList, assetFilter, setAssetFilter, setServiceSearchKey } = useServices();

  const onServiceKeyChange = useCallback((serviceSearchkey: string) => {
    setServiceSearchKey(serviceSearchkey);
  }, []);

  return (
    <div className="flex flex-col w-full pt-[1rem] px-[2.25rem]">
      <div className="flex flex-row justify-between items-center w-full">
        <Menu noMargin={true} compClass="w-3/5" />
        <ServicesFilters
          onServiceKeyChange={onServiceKeyChange}
          assetFilter={assetFilter}
          onAssetFilterChange={onAssetFilterChange}
        />
      </div>

      <div className="flex flex-col items-start justify-start w-full h-full">
        <ServicesList services={serviceList} />
      </div>
    </div>
  );

  function onAssetFilterChange(assetFilter: string[]) {
    setAssetFilter(assetFilter);
  }
}
