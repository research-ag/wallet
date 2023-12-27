import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { MouseEvent } from "react";

interface ICalendarDaysProps {
  generateWeeksOfTheMonth: Date[][];
  selectedDate: Dayjs;
  handleChangeDate: (day: Dayjs) => void;
}

type THandleDateChange = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, date: Date) => void;

export default function CalendarDays(props: ICalendarDaysProps) {
  const { generateWeeksOfTheMonth, handleChangeDate, selectedDate } = props;

  const handleDateChange: THandleDateChange = (e, date) => {
    e.preventDefault();
    handleChangeDate(dayjs(date));
  };

  return (
    <div className="w-full p-2">
      <div className="flex justify-between">
        {generateWeeksOfTheMonth[0].map((day, index) => (
          <span key={`week-day-${index}`} className="p-2 text-right text-md">
            {dayjs(day).format("dd")}
          </span>
        ))}
      </div>

      <div>
        {generateWeeksOfTheMonth.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="flex justify-between">
            {week.map((day, dayIndex) => (
              <button
                key={`day-${dayIndex}`}
                className={`cursor-pointer px-2 ${dayItemStyles(selectedDate, day)}`}
                onClick={(e) => handleDateChange(e, day)}
              >
                {day.getDate()}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const dayItemStyles = (selectedDate: Dayjs, day: Date) => {
  const isNotCurrentMonth = selectedDate.clone().toDate().getMonth() !== day.getMonth();
  const isSelected = selectedDate.isSame(day, "day");

  return clsx("cursor-pointer w-8 h-8 text-md", {
    "text-gray-600": isNotCurrentMonth,
    "text-white": !isNotCurrentMonth,
    "bg-[#33B2EF] rounded-full": isSelected,
  });
};
