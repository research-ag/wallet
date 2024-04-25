import { CustomInput } from "@components/input";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { validatePrincipal } from "@/utils/identity";
import WatchOnlyInputSuffix from "./WatchOnlyInputSuffix";
import WatchOnlyRecordsPopover from "./WatchOnlyRecordsPopover";
import { getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";

interface WatchOnlyInputProps {
  principalAddress: string;
  setPrincipalAddress: Dispatch<SetStateAction<string>>;
}

export default function WatchOnlyInput(props: WatchOnlyInputProps) {
  const [currentAlias, setCurrentAlias] = useState<string>("");
  const { principalAddress, setPrincipalAddress } = props;
  const [historicalOpen, setHistoricalOpen] = useState(false);

  useEffect(() => {
    const aliases = getWatchOnlySessionsFromLocal();
    const alias = aliases.find((session) => session.principal === principalAddress)?.alias
    setCurrentAlias(alias || "");
  }, [principalAddress]);

  return (
    <div className="relative w-full">
      <CustomInput
        sizeInput={"medium"}
        intent={"secondary"}
        compOutClass=""
        value={`${currentAlias} ${currentAlias && currentAlias ? "|" : ""} ${principalAddress}`}
        onChange={onPrincipalChange}
        autoFocus
        border={validatePrincipal(principalAddress) ? undefined : "error"}
        sufix={
          <WatchOnlyInputSuffix
            principalAddress={principalAddress}
            watchOnlyLoginErr={!validatePrincipal(principalAddress)}
            historicalOpen={historicalOpen}
            onChevronClick={() => setHistoricalOpen((prev) => !prev)}
          />
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") handlePrincipalAuthenticated(principalAddress);
        }}
      />
      {historicalOpen && <WatchOnlyRecordsPopover onHistoricalSelectHandler={onHistoricalSelectHandler} />}
    </div>
  );

  function onPrincipalChange(e: ChangeEvent<HTMLInputElement> | string) {
    const value = typeof e === "string" ? e : e.target.value;
    setPrincipalAddress(value);
  }

  function onHistoricalSelectHandler(principal: string) {
    setHistoricalOpen(false);
    setPrincipalAddress(principal);
    onPrincipalChange(principal);
  }
}

export interface WatchOnlyItem {
  principal: string;
  alias?: string;
}
