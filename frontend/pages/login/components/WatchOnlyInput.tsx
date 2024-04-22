import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
//
import { CustomInput } from "@components/input";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import { clsx } from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"

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
        onBlur={() => setHistoricalOpen(false)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        sufix={<CheckIcon className={getCheckIconStyles(principalAddress, watchOnlyLoginErr)} />}
        onKeyDown={(e) => {
          if (e.key === "Enter") handlePrincipalAuthenticated(principalAddress);
        }}
      />
      {(historicalOpen && historicalItems.length) && (
        <div className={itemsRootStyles}>
          {historicalItems.map((data) =>
            <HistoricalItem key={data.principal} onHistoricalSelectHandler={onHistoricalSelectHandler} data={data} />
          )}
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
  };

  function onHistoricalSelectHandler(principal: string) {
    // FIXME: onBlur close before the state changes
    setPrincipalAddress(principal);
  };
}

interface HistoricalItemProps {
  onHistoricalSelectHandler: (principal: string) => void;
  data: HistoricalItem;
  isLast?: boolean;
};

function HistoricalItem(props: HistoricalItemProps) {
  const { onHistoricalSelectHandler, data } = props;

  return (
    <div className={itemStyles} onClick={() => onHistoricalSelectHandler(data.principal)}>
      <div className="flex items-center justify-between">
        <CounterClockwiseClockIcon className="w-4 h-4 mr-2" />
        <div className="text-left">
          <div className="text-sm">{(!data?.alias || data?.alias?.length > 0) ? data.alias : "-"}</div>
          <div className="text-sm">{data.principal}</div>
        </div>
      </div>
    </div>
  );
};

interface HistoricalItem { principal: string; alias?: string; };

const historicalItems: HistoricalItem[] = [
  { principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe", alias: "Will" },
  { principal: "r4jkc-ykktj-k5y7l-fqule-ypybt-h2m5n-nzvlk-xov2a-ipgn7-wb5hx-yae", alias: "Alex" },
  { principal: "fu2m3-wba2s-but7a-nh2mf-w6suf-f5wgs-66ypw-lk3sq-wmtwi-mulho-eqe", alias: "Marcus" },
  { principal: "7gits-op7kf-cwpag-qpxem-ii76c-4a354-rssxw-m577x-xwngm-ofizz-gae", alias: "Daniel" },
  { principal: "7hqk2-23ch6-eh6aw-qlvfl-qcjj5-xuzqr-lhofr-bei27-hhzx7-55smf-gqe", alias: "Michael" },
  { principal: "4byn6-vtzez-5snfu-ehawo-yowuh-rzvrg-6ipvm-iybnd-x5my2-4my4v-eqe", alias: "Luis" },
  { principal: "gcaux-pumlo-me3jn-amyhs-r23a3-ki6zt-rhu7z-u6vaz-ionv3-kvsvw-2ae", alias: "Jackson" },
  { principal: "v6nsf-f45ft-d2rrq-bhwey-4ua3n-5p6oh-vxnhc-vsehj-nx346-d3l2k-bqe", alias: "Allen" },
  { principal: "xouds-7gntn-y4phg-nyclq-bruoh-bjkft-lfkmx-yzber-ngxmx-45hul-jqe", alias: "Alba" },
  { principal: "26qgg-pi4c6-j5ebh-6s77s-j5blv-c3gvt-lbu3q-gucki-clsm2-mdidp-eae", alias: "Anderson" },
  { principal: "a5qju-4vogb-ioqpe-4tmoe-fsc46-qtahz-7u77z-lt42a-6qb6b-ajf6c-oae", alias: "Anthony" },
];

function getCheckIconStyles(principalAddress: string, watchOnlyLoginErr: boolean) {
  return clsx(
    "w-4 h-4 opacity-50 mr-2",
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
