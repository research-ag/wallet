import { assetsServiceToData } from "@common/utils/service";
import { Service, ServiceAsset, ServiceAssetData, ServiceData } from "@redux/models/ServiceModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { saveServices } from "@/redux/services/ServiceActions";

interface ServiceState {
  servicesData: ServiceData[];
  services: Service[];
  serviceAssets: ServiceAsset[];
}

const initialState: ServiceState = {
  servicesData: [],
  services: [],
  serviceAssets: [],
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServicesData(state, action: PayloadAction<ServiceData[]>) {
      state.servicesData = action.payload;
    },
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload;
    },
    addService(state, action: PayloadAction<Service>) {
      const auxGlobalServiceAssets: ServiceAsset[] = [];
      action.payload.assets.map((asst) => {
        const find = state.serviceAssets.find((ast) => ast.principal === asst.principal);
        if (!find) {
          auxGlobalServiceAssets.push(asst);
        }
      });
      state.serviceAssets = [...state.serviceAssets, ...auxGlobalServiceAssets];

      state.services.push(action.payload);
      const auxAssets = action.payload.assets
        .filter((asst) => asst.visible)
        .map((asst) => {
          return {
            tokenSymbol: asst.tokenSymbol,
            tokenName: asst.tokenName,
            decimal: asst.decimal,
            shortDecimal: asst.shortDecimal,
            principal: asst.principal,
            logo: asst.logo,
          } as ServiceAssetData;
        });
      state.servicesData.push({ name: action.payload.name, principal: action.payload.principal, assets: auxAssets });
    },
    removeService(state, action: PayloadAction<string>) {
      const auxServices = state.services.filter((srv) => srv.principal !== action.payload);
      state.serviceAssets = getFilterAssets(auxServices);
      state.services = auxServices;
      state.servicesData = state.servicesData.filter((srv) => srv.principal !== action.payload);
    },
    editServiceName(state, action: PayloadAction<Service>) {
      state.services = state.services.map((srv) => {
        if (srv.principal !== action.payload.principal) {
          return srv;
        } else {
          return { ...srv, name: action.payload.name };
        }
      });
      state.servicesData = state.servicesData.map((srv) => {
        if (srv.principal !== action.payload.principal) {
          return srv;
        } else {
          return { ...srv, name: action.payload.name };
        }
      });
    },
    addServiceAsset: {
      reducer(state: ServiceState, { payload }: PayloadAction<{ service: string; serviceAssets: ServiceAsset[] }>) {
        const { service, serviceAssets } = payload;

        serviceAssets.map((asst) => {
          const find = state.serviceAssets.find((ast) => ast.principal === asst.principal);
          if (find) {
            const index = state.serviceAssets.indexOf(find);
            state.serviceAssets[index].visible = true;
          } else {
            state.serviceAssets.push({ ...asst, visible: true });
          }
        });

        const auxServices: Service[] = [];
        state.services.map((srv) => {
          if (srv.principal === service) {
            const auxAssetService = srv.assets.map((ast) => {
              const auxAsset = serviceAssets.find((srvAsst) => srvAsst.principal === ast.principal);
              if (!auxAsset) return ast;
              else return { ...ast, visible: true };
            });
            auxServices.push({ ...srv, assets: auxAssetService });
          } else auxServices.push(srv);
        });
        state.services = auxServices;

        const auxServicesData: ServiceData[] = [];
        state.servicesData.map((srv) => {
          if (srv.principal === service) {
            auxServicesData.push({ ...srv, assets: [...srv.assets, ...assetsServiceToData(serviceAssets)] });
          } else auxServicesData.push(srv);
        });
        state.servicesData = auxServicesData;
      },
      prepare(service: string, serviceAssets: ServiceAsset[]) {
        return { payload: { service, serviceAssets } };
      },
    },
    removeServiceAsset: {
      reducer(state: ServiceState, { payload }: PayloadAction<{ service: string; serviceAsset: ServiceAsset }>) {
        const { service, serviceAsset } = payload;
        const auxServices: Service[] = [];
        state.services.map((srv) => {
          if (srv.principal === service) {
            const auxAssetService = srv.assets.map((ast) => {
              if (ast.principal !== serviceAsset.principal) return ast;
              else return { ...ast, visible: false };
            });
            auxServices.push({ ...srv, assets: auxAssetService });
          } else auxServices.push(srv);
        });
        state.serviceAssets = getFilterAssets(auxServices);
        state.services = auxServices;

        const auxServicesData: ServiceData[] = [];
        state.servicesData.map((srv) => {
          if (srv.principal === service) {
            const auxAssetServiceData = srv.assets.filter((ast) => ast.principal !== serviceAsset.principal);
            auxServicesData.push({ ...srv, assets: auxAssetServiceData });
          } else auxServicesData.push(srv);
        });
        state.servicesData = auxServicesData;
      },
      prepare(service: string, serviceAsset: ServiceAsset) {
        return { payload: { service, serviceAsset } };
      },
    },
    updateServiceAssetAmounts: {
      reducer(
        state: ServiceState,
        {
          payload,
        }: PayloadAction<{
          service: string;
          serviceAsset: string;
          credit: string | undefined;
          deposit: string | undefined;
        }>,
      ) {
        const { service, serviceAsset, credit, deposit } = payload;
        const auxServices: Service[] = [];
        state.services.map((srv) => {
          if (srv.principal === service) {
            const auxAssetService = srv.assets.map((asst) => {
              if (asst.principal === serviceAsset) {
                return { ...asst, credit: credit || asst.credit, balance: deposit || asst.balance };
              } else return asst;
            });

            auxServices.push({ ...srv, assets: auxAssetService });
          } else {
            auxServices.push(srv);
          }
        });
        state.services = auxServices;
      },
      prepare(service: string, serviceAsset: string, credit: string | undefined, deposit: string | undefined) {
        return { payload: { service, serviceAsset, credit, deposit } };
      },
    },
    removeAssetFromServices(state, action: PayloadAction<{ addres: string; authClient: string }>) {
      const auxServices = state.services.map((srv) => {
        const updatedAssets = srv.assets.map((ast) => {
          if (ast.principal !== action.payload.addres) {
            return { ...ast, visible: false };
          } else return ast;
        });
        return { ...srv, assets: updatedAssets };
      });
      const auxServicesData = state.servicesData.map((srv) => {
        const updatedAssets = srv.assets.filter((ast) => ast.principal !== action.payload.addres);
        return { ...srv, assets: updatedAssets };
      });
      state.services = auxServices;
      state.servicesData = auxServicesData;
      saveServices(auxServicesData);
    },
    setServiceAssets(state, action: PayloadAction<ServiceAsset[]>) {
      state.serviceAssets = action.payload;
    },
    clearServiceData(state) {
      state.serviceAssets = [];
      state.services = [];
      state.servicesData = [];
    },
  },
});

function getFilterAssets(services: Service[]) {
  const filterAssets: ServiceAsset[] = [];
  services.map((srv) => {
    srv.assets.map((ast) => {
      const filterAsset = filterAssets.find((fAsst) => fAsst.principal === ast.principal);
      if (filterAsset) {
        const index = filterAssets.indexOf(filterAsset);
        if (filterAsset.visible) filterAssets[index].visible = true;
      } else {
        filterAssets.push(ast);
      }
    });
  });
  return filterAssets;
}

export const {
  setServicesData,
  setServices,
  addService,
  removeService,
  editServiceName,
  addServiceAsset,
  removeServiceAsset,
  updateServiceAssetAmounts,
  removeAssetFromServices,
  setServiceAssets,
  clearServiceData,
} = servicesSlice.actions;
export default servicesSlice.reducer;
