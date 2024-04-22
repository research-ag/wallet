import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
//
import { CustomInput } from "@components/input";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import { clsx } from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";


interface WatchOnlyInputProps {
  principalAddress: string;
  setPrincipalAddress: Dispatch<SetStateAction<string>>;
}

export default function WatchOnlyInput(props: WatchOnlyInputProps) {
  const { principalAddress, setPrincipalAddress } = props;
  const [watchOnlyLoginErr, setWatchOnlyLoginErr] = useState(false);

  const [historicalOpen, setHistoricalOpen] = useState(false);

  console.log({
    historicalOpen,
  });

  function onOpenChangeHandler(open: boolean) {
    console.log('Popover open:', open);
  };

  function onFocusChangeHandler() {
    if (!historicalOpen) setHistoricalOpen((prev) => !prev);
  };

  function onHistoricalSelectHandler(principal: string) {
    console.log('Selected principal:', principal);
  };

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
        onBlur={() => setHistoricalOpen(false)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        sufix={<CheckIcon className={getCheckIconStyles(principalAddress, watchOnlyLoginErr)} />}
        onKeyDown={(e) => {
          if (e.key === "Enter") handlePrincipalAuthenticated(principalAddress);
        }}
      />
      {historicalOpen && (
        <div className="absolute z-10 w-full mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-green-600 cursor-pointer hover:bg-green-700" onClick={() => onHistoricalSelectHandler(`0x1234...567${i}`)}>
              <div className="flex items-center justify-between p-2">
                <div className="text-sm">
                  <span className="mr-2">Icon</span>
                  Principal {i}
                </div>
                <div className="text-sm">0x1234...5678</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  function onPrincipalChange(e: ChangeEvent<HTMLInputElement>) {
    setPrincipalAddress(e.target.value);
    try {
      decodeIcrcAccount(e.target.value);
      setWatchOnlyLoginErr(false);
    } catch {
      setWatchOnlyLoginErr(true);
    }
  }
}

function getCheckIconStyles(principalAddress: string, watchOnlyLoginErr: boolean) {
  return clsx(
    "w-4 h-4 opacity-50 mr-2",
    principalAddress.length > 0 && !watchOnlyLoginErr
      ? "stroke-BorderSuccessColor"
      : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}
