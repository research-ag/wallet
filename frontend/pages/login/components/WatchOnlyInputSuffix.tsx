import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";

import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";

interface WatchOnlyInputSuffixProps {
  principalAddress: string;
  watchOnlyLoginErr: boolean;
  historicalOpen: boolean;
  onChevronClick: () => void;
}

export default function WatchOnlyInputSuffix(props: WatchOnlyInputSuffixProps) {
  const { principalAddress, watchOnlyLoginErr, historicalOpen, onChevronClick } = props;

  return (
    <div className="flex">
      <CheckIcon
        className={getCheckIconStyles(principalAddress, watchOnlyLoginErr)}
        onClick={() => handlePrincipalAuthenticated(principalAddress)}
      />

      {historicalOpen ? (
        <ChevronDownIcon className="w-4 h-4 cursor-pointer text-black-color dark:text-white" onClick={onChevronClick} />
      ) : null}
      {!historicalOpen ? (
        <ChevronLeftIcon className="w-4 h-4 cursor-pointer text-black-color dark:text-white" onClick={onChevronClick} />
      ) : null}
    </div>
  );
}

function getCheckIconStyles(principalAddress: string, watchOnlyLoginErr: boolean) {
  return clsx({
    "w-4 h-4 opacity-50 mr-2 cursor-pointer": true,
    "stroke-BorderSuccessColor": principalAddress.length > 0 && !watchOnlyLoginErr,
    "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor": !principalAddress.length || watchOnlyLoginErr,
  });
}
