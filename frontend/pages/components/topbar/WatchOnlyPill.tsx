import { useAppSelector } from "@redux/Store";
import WatchOnlyRecords from "./WatchOnlyRecords";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { shortAddress } from "@/utils";
import { getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";
import { MAX_ALIAS_ADDRESS_LENGTH } from "./useWatchOnlyMutation";

interface WatchOnlyPillProps {
  text: string;
  icon?: string;
}

export default function WatchOnlyPill({ text, icon }: WatchOnlyPillProps) {
  const [currentAlias, setCurrentAlias] = useState<string>("");
  const { watchOnlyMode, userPrincipal } = useAppSelector((state) => state.auth);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  useEffect(() => {
    const aliases = getWatchOnlySessionsFromLocal();
    const alias = aliases.find((session) => session.principal === userPrincipal.toString())?.alias;
    setCurrentAlias(alias || "");
  }, [userPrincipal]);

  const spaces = Math.floor((MAX_ALIAS_ADDRESS_LENGTH - currentAlias.length) / 2);

  return (
    <div className="relative w-[16rem]">
      <div className="px-1 py-1 rounded-lg border border-GrayColor/50">
        <div className="flex items-center justify-between w-full gap-2 whitespace-nowrap">
          <img src={icon} alt="icon" className="w-5" />
          <p className="text-md">
            <span className="font-bold">{currentAlias}</span> | {shortAddress(text, spaces, spaces)}
          </p>

          <div className="flex">
            {historicalOpen ? <ChevronDownIcon className="w-4 h-4 cursor-pointer" onClick={onOpenChange} /> : null}
            {!historicalOpen ? <ChevronLeftIcon className="w-4 h-4 cursor-pointer" onClick={onOpenChange} /> : null}
          </div>
        </div>
      </div>

      {watchOnlyMode && historicalOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onOpenChange}></div>
          <WatchOnlyRecords start={3} end={3} />
        </>
      )}
    </div>
  );

  function onOpenChange() {
    setHistoricalOpen((prev) => !prev);
  }
}
