import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import { ChangeEvent, useRef, useState } from "react";
import { validatePrincipal } from "@/utils/identity";
import WatchOnlyInputSuffix from "./WatchOnlyInputSuffix";
import WatchOnlyRecordsPopover from "./WatchOnlyRecordsPopover";
import { useAppSelector } from "@redux/Store";

export default function WatchOnlyInput() {
  const { watchOnlyHistory } = useAppSelector((state) => state.auth);
  const [principalAddress, setPrincipalAddress] = useState("");
  const watchOnlyInputRef = useRef<HTMLInputElement>(null);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  const alias = watchOnlyHistory.find((session) => session.principal === principalAddress)?.alias;

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-start border rounded bg-inherit border-gray-color-2 dark:border-gray-color-6">
        {alias ? (
          <p className="px-2 font-bold border-r-2 text-md border-gray-color-2 dark:border-gray-color-6">{alias}</p>
        ) : null}

        <input
          autoFocus
          type="text"
          className="w-full p-2 outline-none bg-inherit"
          onChange={onPrincipalChange}
          ref={watchOnlyInputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") handlePrincipalAuthenticated(principalAddress);
          }}
        />
        <WatchOnlyInputSuffix
          principalAddress={principalAddress}
          watchOnlyLoginErr={!validatePrincipal(principalAddress)}
          historicalOpen={historicalOpen}
          onChevronClick={() => setHistoricalOpen((prev) => !prev)}
        />
      </div>
      {historicalOpen && <WatchOnlyRecordsPopover onHistoricalSelectHandler={onHistoricalSelectHandler} />}
    </div>
  );

  function onPrincipalChange(e: ChangeEvent<HTMLInputElement> | string) {
    const principal = typeof e === "string" ? e.trim() : e.target.value.trim();
    setPrincipalAddress(principal);
  }

  function onHistoricalSelectHandler(principal: string) {
    setHistoricalOpen(false);
    setPrincipalAddress(principal);
    onPrincipalChange(principal);
    if (watchOnlyInputRef.current) watchOnlyInputRef.current.value = principal;
  }
}

export interface WatchOnlyItem {
  principal: string;
  alias?: string;
}
