import { db, DB_Type } from "@/database/db";
import { DbLocationHook } from "@pages/hooks/dbLocationHook";
import { useEffect, useRef } from "react";

export default function DatabaseWrapper({ children }: { children: JSX.Element }) {
  const isFirstRenderRef = useRef(true);
  const { changeDbLocation } = DbLocationHook();

  useEffect(() => {
    if (!isFirstRenderRef.current) return;
    isFirstRenderRef.current = false;
    !db().getDbLocation() && db().setDbLocation(DB_Type.LOCAL);
    changeDbLocation(db().getDbLocation() || DB_Type.LOCAL);
  }, []);

  return <>{children}</>;
}
