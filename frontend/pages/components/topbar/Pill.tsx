import { shortAddress } from "@/utils";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useAppSelector } from "@redux/Store";
import WatchOnlyRecords from "./WatchOnlyRecords";
import { useState } from "react";

interface PillProps {
  text: string;
  start: number;
  end: number;
  icon?: string;
}

export default function Pill({ text, start, end, icon }: PillProps) {
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  return (
    <div className="relative">
      <div className="px-3 py-1 rounded-full bg-GrayColor/50">
        <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap">
          <img src={icon} alt="icon" className="w-5" />
          {shortAddress(text, start, end)}
          {watchOnlyMode &&
            (historicalOpen ? (
              <ChevronDownIcon className="w-4 h-4 cursor-pointer" onClick={onOpenHistorical} />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 cursor-pointer" onClick={onOpenHistorical} />
            ))}
        </div>
      </div>

      {watchOnlyMode && historicalOpen && <WatchOnlyRecords start={start} end={end} />}
    </div>
  );

  function onOpenHistorical() {
    setHistoricalOpen((prev) => !prev);
  }
}
