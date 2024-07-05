import { Principal } from "@dfinity/principal";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { Service } from "@redux/models/ServiceModels";
import { getServiceData, testServicePrincipal } from "@redux/services/ServiceActions";
import { addService } from "@redux/services/ServiceReducer";
import { isArray } from "lodash";
import { ChangeEvent, useState } from "react";

export default function useNewServices() {
  const dispatch = useAppDispatch();
  const { userAgent } = useAppSelector((state) => state.auth);
  const { services } = useAppSelector((state) => state.services);

  const [newService, setNewService] = useState<Service>({
    name: "",
    principal: "",
    assets: [],
  });
  const [newServiceErr, setNewServiceErr] = useState({
    name: false,
    principal: false,
  });

  const [showDuplicate, setShowDuplicate] = useState(false);

  function onServiceNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNewService((prev: any) => {
      return { ...prev, name: e.target.value };
    });
    setNewServiceErr((prev: any) => {
      return { name: e.target.value.trim() === "", principal: prev.principal };
    });
  }
  function onServicePrincipalChange(e: ChangeEvent<HTMLInputElement>) {
    setNewService((prev: any) => {
      return { ...prev, principal: e.target.value };
    });
    setShowDuplicate(false);
    try {
      Principal.fromText(e.target.value.trim());
      setNewServiceErr((prev) => {
        return { name: prev.name, principal: false };
      });
    } catch {
      setNewServiceErr((prev: any) => {
        return { name: prev.name, principal: true };
      });
    }
  }
  async function saveService() {
    if (!newServiceErr.name && !newServiceErr.principal) {
      const exist = services.find((srv) => srv.principal === newService.principal.trim());
      if (exist) return { success: false, err: "service-duplicate-err" };
      if (await testServicePrincipal(userAgent, newService.principal.trim())) {
        const newAssets = await getServiceData(userAgent, newService.principal.trim());
        if (isArray(newAssets)) {
          dispatch(
            addService({ name: newService.name.trim(), principal: newService.principal.trim(), assets: newAssets }),
          );
          return { success: true, err: "" };
        } else {
          return { success: false, err: newAssets };
        }
      } else return { success: false, err: "service-not-valid" };
    } else return { success: false, err: newServiceErr.name ? "service-name-data-err" : "service-principal-data-err" };
  }

  return {
    newService,
    setNewService,
    newServiceErr,
    showDuplicate,
    setShowDuplicate,
    setNewServiceErr,
    onServiceNameChange,
    onServicePrincipalChange,
    saveService,
  };
}
