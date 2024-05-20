import Menu from "@pages/components/Menu";
import ServicesFilters from "@/pages/services/components/ServicesFilters";
import ServicesList from "@/pages/services//components/ServicesList";
import { useCallback, useState } from "react";

export default function Services() {
  console.log("Services");

  const [assetFilter, setAssetFilter] = useState<string[]>([]);
  const [serviceSearchkey, setServiceSearchKey] = useState("");

  const onServiceKeyChange = useCallback((serviceSearchkey: string) => {
    setServiceSearchKey(serviceSearchkey);
  }, []);

  return (
    <div className="flex flex-col w-full pt-[1rem] px-[2.25rem]">
      <Menu />

      <div className="flex flex-col items-start justify-start w-full h-full">
        <ServicesFilters onServiceKeyChange={onServiceKeyChange} assetFilter={assetFilter} onAssetFilterChange={onAssetFilterChange} />
        <ServicesList serviceSearchkey={serviceSearchkey} assetFilter={assetFilter} />
      </div>
    </div>
  );

  function onAssetFilterChange(assetFilter: string[]) {
    setAssetFilter(assetFilter);
  };
}
