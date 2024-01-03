import { TUnit } from "@/hooks/useCalendar";
import { Dayjs } from "dayjs";
import { ReactComponent as ChevronRightIcon } from "@assets/svg/files/chevron-right-icon.svg";

interface TimeUnit {
  value: string;
  format: string;
  increment: () => void;
  decrement: () => void;
}

interface IDateTimePickerProps {
  selectedDate: Dayjs;
  modifyDateTime: (unit: TUnit, increment: boolean) => void;
  toggleAmPm: () => void;
}

export default function CalendarTime(props: IDateTimePickerProps) {
  const { selectedDate, modifyDateTime, toggleAmPm } = props;

  const timeUnits: TimeUnit[] = [
    {
      value: selectedDate.format("hh"),
      format: "hh",
      increment: () => modifyDateTime("hour", true),
      decrement: () => modifyDateTime("hour", false),
    },
    {
      value: selectedDate.format("mm"),
      format: "mm",
      increment: () => modifyDateTime("minute", true),
      decrement: () => modifyDateTime("minute", false),
    },
    {
      value: selectedDate.format("ss"),
      format: "ss",
      increment: () => modifyDateTime("second", true),
      decrement: () => modifyDateTime("second", false),
    },
    {
      value: selectedDate.format("a"),
      format: "a",
      increment: toggleAmPm,
      decrement: toggleAmPm,
    },
  ];

  return (
    <div className="flex items-center justify-evenly bg-[#141331] py-2 rounded-b-lg">
      {timeUnits.map((unit) => (
        <div key={unit.format} className="w-10 text-white">
          <span className="grid cursor-pointer place-items-center" onClick={unit.increment}>
            <ChevronRightIcon className="w-4 h-4 rotate-90 " />
          </span>
          <p className="p-2 text-lg text-center bg-[#211E49] rounded-lg my-1 border border-[#3C3867]">{unit.value}</p>
          <span className="grid cursor-pointer place-items-center" onClick={unit.decrement}>
            <ChevronRightIcon className="w-4 h-4 -rotate-90 " />
          </span>
        </div>
      ))}
    </div>
  );
}
