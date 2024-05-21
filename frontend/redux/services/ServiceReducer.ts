import { Service, ServiceData } from "@redux/models/ServiceModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ServiceState {
  servicesData: ServiceData[];
  services: Service[];
}

const initialState: ServiceState = {
  servicesData: [],
  services: [],
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
      state.services.push(action.payload);
      state.servicesData.push({ name: action.payload.name, principal: action.payload.principal });
    },
    removeService(state, action: PayloadAction<string>) {
      state.services = state.services.filter((srv) => srv.principal !== action.payload);
      state.servicesData = state.servicesData.filter((srv) => srv.principal !== action.payload);
    },
    editService(state, action: PayloadAction<Service>) {
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
  },
});

export const { setServicesData, setServices, addService, removeService, editService } = servicesSlice.actions;
export default servicesSlice.reducer;
