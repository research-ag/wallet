import { GlobalDebug } from "@/RemoveLogs";
import { useEffect } from "react";

export default function DebugWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import.meta.env.NODE_ENV === "PRODUCTION" && GlobalDebug(false, true);
  }, []);

  return <>{children}</>;
}
