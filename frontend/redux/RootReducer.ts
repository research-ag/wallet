import { combineReducers } from "redux";
import authReducer from "./auth/AuthReducer";
import AssetReducer from "./assets/AssetReducer";
import ContactsReducer from "./contacts/ContactsReducer";
import AllowanceReducer from "./allowance/AllowanceReducer";



const appReducer = combineReducers({
  auth: authReducer,
  asset: AssetReducer,
  contacts: ContactsReducer,
  allowance: AllowanceReducer,
});

const RootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

export default RootReducer;
