import { AuthClient } from "@dfinity/auth-client";
import watchOnlyRefresh from "@pages/helpers/watchOnlyRefresh";
import { handleLoginApp } from "@redux/CheckAuth";
import { useAppDispatch } from "@redux/Store";
import { setAuth } from "@redux/auth/AuthReducer";
import { useEffect, useRef } from "react";
import logger from "@/common/utils/logger";

export default function IdentityWrapper({ children }: { children: JSX.Element }) {
  const isFirstRenderRef = useRef(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isFirstRenderRef.current) return;
    isFirstRenderRef.current = false;

    const getIdentity = async () => {
      const authClient = await AuthClient.create();
      const valid = await authClient.isAuthenticated();
      if (valid) {
        handleLoginApp(authClient.getIdentity());
      } else {
        dispatch(setAuth());
      }
    };
    getIdentity().catch(logger.debug);
    watchOnlyRefresh();
  }, []);

  return <>{children}</>;
}
