import { useAppSelector } from "@redux/Store";
import { Service, ServiceAsset } from "@redux/models/ServiceModels";
import { saveServices } from "@redux/services/ServiceActions";
import { useEffect, useState } from "react";

// TODO: implement filtering
export default function useServices() {
  const { authClient } = useAppSelector((state) => state.auth);
  const { services, servicesData, serviceAssets } = useAppSelector((state) => state.services);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [assetFilter, setAssetFilter] = useState<string[]>([]);
  const [serviceSearchkey, setServiceSearchKey] = useState("");
  const [supportedAssetsActive, setSupportedAssetsActive] = useState(false);
  const [filterAssets, setFilterAssets] = useState<ServiceAsset[]>([]);
  const [newService, setNewService] = useState(false);

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
    const auxFilterAssets = serviceAssets.filter((ast) => supportedAssetsActive || ast.visible);
    setFilterAssets(auxFilterAssets);
    if (!supportedAssetsActive) {
      const auxFilter: string[] = [];
      assetFilter.map((astFil) => {
        const auxAsst = auxFilterAssets.find((auxF) => auxF.tokenSymbol === astFil);
        if (auxAsst) auxFilter.push(astFil);
      });
      setAssetFilter(auxFilter);
    }
  }, [supportedAssetsActive, serviceAssets]);

  useEffect(() => {
    saveServices(servicesData);
  }, [servicesData]);

  return {
    services,
    serviceList,
    assetFilter,
    setAssetFilter,
    serviceSearchkey,
    setServiceSearchKey,
    supportedAssetsActive,
    setSupportedAssetsActive,
    filterAssets,
    newService,
    setNewService,
  };
}
