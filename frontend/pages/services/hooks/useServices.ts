import { useAppSelector } from "@redux/Store";
import { Service } from "@redux/models/ServiceModels";
import { useEffect, useState } from "react";

// TODO: implement filtering
export default function useServices() {
  const { authClient } = useAppSelector((state) => state.auth);
  const { services, servicesData } = useAppSelector((state) => state.services);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [assetFilter, setAssetFilter] = useState<string[]>([]);
  const [serviceSearchkey, setServiceSearchKey] = useState("");

  // ServiceTable

  useEffect(() => {
    const auxServices = services.filter((srv) => {
      const searchKey = serviceSearchkey.trim().toLowerCase();
      const matchSearchKey =
        srv.name.toLowerCase().includes(searchKey) || srv.principal.toLowerCase().includes(searchKey);

      const auxAssets = srv.assets.map((ast) => ast.tokenSymbol);
      const matchAssets = auxAssets.find((ast) => assetFilter.includes(ast)) ? true : false || assetFilter.length === 0;
      return matchSearchKey && matchAssets;
    });
    setServiceList(auxServices);
  }, [serviceSearchkey, assetFilter, services]);

  useEffect(() => {
    localStorage.setItem(`services-${authClient}`, JSON.stringify(servicesData));
  }, [servicesData]);

  return {
    services,
    serviceList,
    assetFilter,
    setAssetFilter,
    serviceSearchkey,
    setServiceSearchKey,
  };
}
