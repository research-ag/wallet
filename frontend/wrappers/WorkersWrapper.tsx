import { useEffect } from "react";

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    console.log("worker running");
  }, []);

  return <>{children}</>;
};
