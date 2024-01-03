import { TUnit } from "@/hooks/useCalendar";
import { Dayjs } from "dayjs";
import { ReactComponent as ChevronRightIcon } from "@assets/svg/files/chevron-right-icon.svg";

interface ICalendarControls {
  selectedDate: Dayjs;
  modifyDateTime: (unit: TUnit, increment: boolean) => void;
}

export default function CalendarControls(props: ICalendarControls) {
  const { modifyDateTime, selectedDate } = props;

  const handleOnMonthNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    modifyDateTime("month", true);
  };

  const handleOnMonthPrev = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    modifyDateTime("month", false);
  };

  return (
    <div className="flex items-center py-1 border-b justify-center border-[#322F5B]">
      <button onClick={handleOnMonthPrev} className="grid text-white place-items-center">
        <ChevronRightIcon className="w-4 h-4" />
      </button>
      <p className="text-lg font-bold text-center text-white ">{selectedDate.clone().format("MMMM YYYY")}</p>
      <button onClick={handleOnMonthNext} className="grid text-center place-items-center">
        <ChevronRightIcon className="w-4 h-4 rotate-180" />
      </button>
    </div>
  );
}
