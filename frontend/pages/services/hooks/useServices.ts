import { useAppSelector } from "@redux/Store";
import { Service, ServiceAsset } from "@redux/models/ServiceModels";
import { saveServices } from "@redux/services/ServiceActions";
import { useEffect, useState } from "react";

export default function useServices() {
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

      let isChecked = true;
      assetFilter.map((astFil) => {
        const find = srv.assets.find((ast) => (supportedAssetsActive || ast.visible) && astFil === ast.principal);
        if (!find) {
          isChecked = false;
        }
      });

      return matchSearchKey && isChecked;
    });
    setServiceList(auxServices);
  }, [serviceSearchkey, assetFilter, services, filterAssets]);

  useEffect(() => {
    const auxFilterAssets = serviceAssets.filter((ast) => supportedAssetsActive || ast.visible);
    setFilterAssets(auxFilterAssets);
    if (!supportedAssetsActive) {
      const auxFilter: string[] = [];
      assetFilter.map((astFil) => {
        const auxAsst = auxFilterAssets.find((auxF) => auxF.principal === astFil);
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
