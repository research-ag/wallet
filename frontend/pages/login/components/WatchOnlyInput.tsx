import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
//
import { CustomInput } from "@components/Input";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface WatchOnlyInputProps {
  principalAddress: string;
  setPrincipalAddress: Dispatch<SetStateAction<string>>;
}

export default function WatchOnlyInput(props: WatchOnlyInputProps) {
  const { principalAddress, setPrincipalAddress } = props;
  const [watchOnlyLoginErr, setWatchOnlyLoginErr] = useState(false);

  return (
    <CustomInput
      sizeInput={"medium"}
      intent={"secondary"}
      compOutClass=""
      value={principalAddress}
      onChange={onPrincipalChange}
      border={watchOnlyLoginErr ? "error" : undefined}
      autoFocus
      sufix={<CheckIcon className={getCheckIconStyles(principalAddress, watchOnlyLoginErr)} />}
      onKeyDown={(e) => {
        if (e.key === "Enter") handlePrincipalAuthenticated(principalAddress);
      }}
    />
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
