import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
//
import { CustomInput } from "@components/input";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import { clsx } from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

interface WatchOnlyInputProps {
  principalAddress: string;
  setPrincipalAddress: Dispatch<SetStateAction<string>>;
}

export default function WatchOnlyInput(props: WatchOnlyInputProps) {
  const { principalAddress, setPrincipalAddress } = props;
  const [watchOnlyLoginErr, setWatchOnlyLoginErr] = useState(false);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  return (
    <div className="relative w-full">
      <CustomInput
        sizeInput={"medium"}
        intent={"secondary"}
        compOutClass=""
        value={principalAddress}
        onChange={onPrincipalChange}
        border={watchOnlyLoginErr ? "error" : undefined}
        onFocus={onFocusChangeHandler}
        sufix={
          <CheckIcon
            className={getCheckIconStyles(principalAddress, watchOnlyLoginErr)}
            onClick={() => handlePrincipalAuthenticated(principalAddress)}
          />
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") handlePrincipalAuthenticated(principalAddress);
        }}
      />
      {historicalOpen && historicalItems.length > 0 && (
        <div className={itemsRootStyles}>
          {historicalItems.map((data) => (
            <HistoricalItem key={data.principal} onHistoricalSelectHandler={onHistoricalSelectHandler} data={data} />
          ))}
        </div>
      )}
    </div>
  );

  function onPrincipalChange(e: ChangeEvent<HTMLInputElement> | string) {
    const value = typeof e === "string" ? e : e.target.value;
    setPrincipalAddress(value);
    try {
      decodeIcrcAccount(value);
      setWatchOnlyLoginErr(false);
    } catch {
      setWatchOnlyLoginErr(true);
    }
  }

  function onFocusChangeHandler() {
    if (!historicalOpen) setHistoricalOpen((prev) => !prev);
  }

  function onHistoricalSelectHandler(principal: string) {
    setHistoricalOpen(false);
    setPrincipalAddress(principal);
    onPrincipalChange(principal);
  }
}

interface HistoricalItemProps {
  onHistoricalSelectHandler: (principal: string) => void;
  data: WatchOnlyItem;
  isLast?: boolean;
}

function HistoricalItem(props: HistoricalItemProps) {
  const { onHistoricalSelectHandler, data } = props;

  return (
    <div className={itemStyles} onClick={() => onHistoricalSelectHandler(data.principal)}>
      <div className="flex items-center justify-between">
        <CounterClockwiseClockIcon className="w-4 h-4 mr-2" />
        <div className="text-left">
          <div className="text-sm">{!data?.alias || data?.alias?.length > 0 ? data.alias : "-"}</div>
          <div className="text-sm">{data.principal}</div>
        </div>
      </div>
    </div>
  );
}

export interface WatchOnlyItem {
  principal: string;
  alias?: string;
}

export const historicalItems: WatchOnlyItem[] = [];

function getCheckIconStyles(principalAddress: string, watchOnlyLoginErr: boolean) {
  return clsx(
    "w-4 h-4 opacity-50 mr-2 cursor-pointer",
    principalAddress.length > 0 && !watchOnlyLoginErr
      ? "stroke-BorderSuccessColor"
      : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}

const itemsRootStyles = clsx(
  "absolute z-10 w-full mt-1",
  "bg-white dark:bg-level-1-color",
  "rounded-sm shadow-lg",
  "overflow-y-auto  scroll-y-light",
  "max-h-[10rem]",
);

const itemStyles = clsx(
  "cursor-pointer",
  "flex items-center justify-between px-2 py-1",
  "dark:bg-level-1-color bg-secondary-color-1-light",
  "dark:hover:bg-secondary-color-2 hover:bg-secondary-color-2-light",
  "text-black-color dark:text-white",
  "transition-all duration-100 ease-in-out",
);
