import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { ThemeHook } from "@/pages/hooks/themeHook";
import { clsx } from "clsx";
import dayjs from "dayjs";

interface CalendarDatePickerProps extends DateTimePickerProps<dayjs.Dayjs> {
  onDateChange: (date: dayjs.Dayjs | null) => void;
  onEnableChange: (enabled: boolean) => void;
}

export default function CalendarPicker(props: CalendarDatePickerProps) {
  const {
    timezone = "system",
    format = "MM/DD/YY hh:mm:ss a",
    timeSteps = { minutes: 1, seconds: 5 },
    disablePast = true,
    disabled = false,
    onDateChange,
    onEnableChange,
    value = dayjs(),
  } = props;

  const { theme } = ThemeHook();
  return (
    <div className="flex items-center justify-start w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="relative">
          <DateTimePicker
            className={dateTimePickerStyles(theme)}
            disabled={disabled}
            value={value}
            onChange={handleDateChange}
            timezone={timezone}
            format={format}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
            timeSteps={timeSteps}
            disablePast={disablePast}
            views={["day", "hours", "minutes", "seconds"]}
          />
          {disabled && (
            <div
              className="absolute w-full h-8 bg-transparent cursor-pointer bottom-1"
              onClick={handleDateEnable}
            ></div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );

  function handleDateChange(date: dayjs.Dayjs | null) {
    if (!date) return;
    onDateChange(date);
  }

  function handleDateEnable() {
    if (!disabled) return;
    onEnableChange(false);
  }
}

function dateTimePickerStyles(theme: string) {
  return clsx("!cursor-pointer !w-full", theme === "light" ? "date-picker-light" : "date-picker");
}
