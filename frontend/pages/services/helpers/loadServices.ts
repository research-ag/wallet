import store from "@redux/Store";
import logger from "@/common/utils/logger";
import { getServicesData } from "@redux/services/ServiceActions";
import { setServiceAssets, setServices, setServicesData } from "@redux/services/ServiceReducer";

export default async function loadServices() {
  try {
    const myAgent = store.getState().auth.userAgent;
    const { services, serviceData, filterAssets } = await getServicesData(myAgent);
    store.dispatch(setServices(services));
    store.dispatch(setServicesData(serviceData));
    store.dispatch(setServiceAssets(filterAssets));
  } catch (error) {
    logger.debug(error);
  }
}
