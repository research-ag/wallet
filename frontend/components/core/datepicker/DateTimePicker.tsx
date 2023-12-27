import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useCalendar } from "@/hooks/useCalendar";
import CalendarControls from "./CalendarControls";
import CalendarTime from "./CalendarTime";
import CalendarDays from "./CalendarDays";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ReactComponent as CalendarIcon } from "@/assets/svg/files/calendar-icon.svg";
import { selectContentCVA, selectTriggerCVA } from "./styles.cva";

interface DateTimePickerProps {
  onChange: (date: Dayjs) => void;
  enabled: boolean;
  onEnableChange?: (value: boolean) => void;
}

export default function DateTimePicker(props: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { onChange, enabled, onEnableChange } = props;
  const { selectedDate, generateWeeksOfTheMonth, modifyDateTime, toggleAmPm, onDateChange } = useCalendar();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) onEnableChange?.(false);
  };

  useEffect(() => {
    onChange(selectedDate);
  }, [selectedDate]);

  return (
    <DropdownMenu.Root modal={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger className={selectTriggerCVA({})}>
        <p className="text-md">{enabled ? dayjs(selectedDate).format("DD/MM/YYYY, HH:mm:ss") : "Date"}</p>
        <CalendarIcon className="w-4 h-4 ml-2" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={selectContentCVA({})}>
        <CalendarControls selectedDate={selectedDate} modifyDateTime={modifyDateTime} />
        <CalendarDays
          generateWeeksOfTheMonth={generateWeeksOfTheMonth}
          handleChangeDate={onDateChange}
          selectedDate={selectedDate}
        />
        <CalendarTime selectedDate={selectedDate} modifyDateTime={modifyDateTime} toggleAmPm={toggleAmPm} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
