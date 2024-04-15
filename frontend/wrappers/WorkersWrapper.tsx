import { setAppDataRefreshing, setLastDataRefresh } from "@redux/common/CommonReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect, useMemo } from "react";


const WORKER_INTERVAL = 10 * 1000; // 10 seconds

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { lastDataRefresh, isAppDataFreshing } = useAppSelector((state) => state.common);

  const assetWorker = useMemo(() => new Worker(new URL("../pages/workers/assets.ts", import.meta.url)), []);

  useEffect(() => {
    if (window.Worker) {

      const intervalId = setInterval(() => {
        console.log("running interval");

        const isOlderThanInterval =
          new Date(lastDataRefresh).getTime() + WORKER_INTERVAL <
          new Date().getTime();

        if (!isAppDataFreshing && isOlderThanInterval) {
          console.log("Running asset worker");
          dispatch(setAppDataRefreshing(true));
          assetWorker.postMessage("Good Job!: " + new Date().toISOString());
        };
      }, WORKER_INTERVAL);

      assetWorker.onmessage = (event: MessageEvent<string>) => {
        console.log("worker message received", event);
        dispatch(setLastDataRefresh(event.data));
        dispatch(setAppDataRefreshing(false));
      };

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [assetWorker, dispatch, isAppDataFreshing, lastDataRefresh]);

  return <>{children}</>;
};
