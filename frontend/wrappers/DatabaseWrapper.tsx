import { db, DB_Type } from "@/database/db";
import { DbLocationHook } from "@pages/hooks/dbLocationHook";
import { useEffect } from "react";

export default function DatabaseWrapper({ children }: { children: JSX.Element }) {
  console.log("data base wrapper");

  const { changeDbLocation } = DbLocationHook();

  useEffect(() => {
    !db().getDbLocation() && db().setDbLocation(DB_Type.LOCAL);
    changeDbLocation(db().getDbLocation() || DB_Type.LOCAL);
  }, []);

  return <>{children}</>;
}
