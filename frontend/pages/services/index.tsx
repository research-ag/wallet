import Menu from "@pages/components/Menu";
import ServicesFilters from "./components/ServicesFilters";
import ServicesList from "./components/ServicesList";
import { useCallback, useState } from "react";

export default function Services() {
  const [serviceSearchkey, setServiceSearchKey] = useState("");

  const onServiceKeyChange = useCallback((serviceSearchkey: string) => {
    setServiceSearchKey(serviceSearchkey);
  }, []);

  return (
    <div className="flex flex-col w-full pt-[1rem] bg-red-900 px-[2rem]">
      <Menu />

      <div className="flex flex-col items-start justify-start w-full h-full bg-blue-500">
        <ServicesFilters onServiceKeyChange={onServiceKeyChange} />
        <ServicesList serviceSearchkey={serviceSearchkey} />
      </div>
    </div>
  );
}
