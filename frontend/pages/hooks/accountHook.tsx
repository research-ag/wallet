import { useAppDispatch, useAppSelector } from "@/redux/Store";
import { setAuthenticated } from "@redux/auth/AuthReducer";

export const AccountHook = () => {
  const dispatch = useAppDispatch();
  const { authClient, userAgent } = useAppSelector((state) => state.auth);
  const setAuthClient = (authClient: string) => {
    dispatch(setAuthenticated(true, false, false, authClient.toLowerCase()));
  };
  return { authClient, setAuthClient, userAgent };
};
