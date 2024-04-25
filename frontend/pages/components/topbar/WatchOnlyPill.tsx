import { useAppSelector } from "@redux/Store";
import WatchOnlyRecords from "./WatchOnlyRecords";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { shortAddress } from "@/utils";

interface WatchOnlyPillProps {
  text: string;
  icon?: string;
}

export default function WatchOnlyPill({ text, icon }: WatchOnlyPillProps) {
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  return (
    <div className="relative w-[16rem]">
      <div className="px-1 py-1 rounded-lg border border-GrayColor/50">
        <div className="flex items-center justify-between w-full gap-2 whitespace-nowrap">
          <img src={icon} alt="icon" className="w-5" />
          <p className="text-md">
            <span className="font-bold">Julio</span> | {shortAddress(text, 10, 10)}
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
