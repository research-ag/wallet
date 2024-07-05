import { getServicesData } from "@redux/services/ServiceActions";
import { setServiceAssets, setServices, setServicesData } from "@redux/services/ServiceReducer";
import store from "@redux/Store";

export default async function serviceCacheRefresh() {
  const { services, serviceData, filterAssets } = await getServicesData();
  store.dispatch(setServices(services));
  store.dispatch(setServicesData(serviceData));
  store.dispatch(setServiceAssets(filterAssets));
}
