import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useCalendar } from "@/hooks/useCalendar";
import CalendarControls from "./CalendarControls";
import CalendarTime from "./CalendarTime";
import CalendarDays from "./CalendarDays";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { ReactComponent as CalendarIcon } from "@/assets/svg/files/calendar-icon.svg";
import { selectContentCVA, selectTriggerCVA } from "./styles.cva";
import { VariantProps } from "cva";

interface DateTimePickerProps extends VariantProps<typeof selectTriggerCVA> {
  onChange: (date: Dayjs) => void;
  onEnableChange?: (value: boolean) => void;
  enabled: boolean;
  FormatedDate?: string;
}

function DateTimePicker(props: DateTimePickerProps) {
  const { onChange, FormatedDate, border } = props;
  const [isOpen, setIsOpen] = useState(false);

  const { selectedDate, generateWeeksOfTheMonth, modifyDateTime, toggleAmPm, onDateChange } = useCalendar(FormatedDate);

  const handleOpenChange = (open: boolean) => {
    if (!isOpen) setIsOpen(open);
  };

  const handleCloseFocus = () => {
    if (dayjs(FormatedDate).isSame(selectedDate)) return;
    onChange(selectedDate);
  };

  return (
    <DropdownMenu.Root modal={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger className={selectTriggerCVA({ border })}>
        <p className="text-md">{dayjs(selectedDate).format("DD/MM/YYYY, HH:mm:ss")}</p>
        <CalendarIcon className="w-4 h-4 ml-2" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={selectContentCVA({})} onCloseAutoFocus={handleCloseFocus}>
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

function DisabledDateTimePicker({ onEnableChange, border }: DateTimePickerProps) {
  const handleEnableChange = () => onEnableChange?.(false);

  return (
    <div className={selectTriggerCVA({ border })} onClick={handleEnableChange}>
      <p className="opacity-50 text-md">Date</p>
    </div>
  );
}

export default function Wrapper(props: DateTimePickerProps) {
  if (!props.enabled) return <DisabledDateTimePicker {...props} />;
  return <DateTimePicker {...props} />;
}