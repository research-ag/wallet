import { shortAddress } from "@/utils";
import { Principal } from "@dfinity/principal";
import { HistoricalItem, historicalItems } from "@pages/login/components/WatchOnlyInput";
import { ChevronDownIcon, ChevronLeftIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useAppSelector } from "@redux/Store";
import { useState } from "react";

interface PillProps {
  text: string;
  start: number;
  end: number;
  icon?: string;
};

export default function Pill({ text, start, end, icon }: PillProps) {
  const { watchOnlyMode } = useAppSelector(state => state.auth);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  return (
    <div className="relative">

      <div className="px-3 py-1 rounded-full bg-GrayColor/50">
        <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap">
          <img src={icon} alt="icon" className="w-5" />
          {shortAddress(text, start, end)}
          {watchOnlyMode &&
            (
              historicalOpen
                ? <ChevronDownIcon className="w-4 h-4 cursor-pointer" onClick={onOpenHistorical} />
                : <ChevronLeftIcon className="w-4 h-4 cursor-pointer" onClick={onOpenHistorical} />
            )
          }
        </div>
      </div>

      {(watchOnlyMode && historicalOpen) && (
        <div className="absolute z-10 w-full max-h-[10rem] overflow-y-auto  scroll-y-light bg-white dark:bg-level-1-color text-left mt-1 rounded-lg shadow-lg">

          {historicalItems.map((data) =>
            <Element key={data.principal} data={data} start={start} end={end} />)}

        </div>
      )}

    </div>
  );

  function onOpenHistorical() {
    setHistoricalOpen((prev) => !prev);
  };

}

function Element({ data, start, end }: { data: HistoricalItem, start: number, end: number }) {
  const [aliasPrincipal, setAliasPrincipal] = useState<Principal | null>(null);


  return (
    <div key={data.principal} className="flex items-center justify-between p-1 cursor-pointer dark:hover:bg-secondary-color-2 hover:bg-secondary-color-2-light" onClick={() => onChangeSession(data.principal)}>

      {aliasPrincipal ?
        (
          <div>
            <input
              type="text"
              className="w-full"
              value={data.alias}
              onChange={(e) => console.log(e.target.value)}
              autoFocus
            />
          </div>
        )
        : (
          <p>
            {data.alias ? data.alias : "-"}
            <span className="text-gray-400"> ({
              shortAddress(data.principal, start, end - (data?.alias?.length || 0))
            })</span>
          </p>
        )
      }

      {aliasPrincipal
        ? <Cross1Icon className="w-3 h-3" onClick={() => console.log("Delete alias")} />
        : <Pencil1Icon className="w-3 h-3" onClick={() => onEditAlias(data.principal)} />
      }

    </div>
  )

  function onEditAlias(principal: string) {
    setAliasPrincipal(Principal.fromText(principal));
  };

  function onChangeSession(principal: string) {
    console.log("Change session to: ", principal);
  };
};
