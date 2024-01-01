import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useReducer } from "react";

export interface CalendarState {
  selectedDate: Dayjs;
}

export enum ActionTypes {
  SetSelectedDate = "SET_SELECTED_DATE",
  AdjustDateTime = "ADJUST_DATE_TIME",
  ToggleAmPm = "AM_PM_TOGGLE",
}

export type TUnit = "year" | "month" | "hour" | "minute" | "second";

export interface AdjustDateTimeAction {
  type: ActionTypes.AdjustDateTime;
  unit: TUnit;
  increment: boolean;
}

const reducer = (state: CalendarState, action: any): CalendarState => {
  switch (action.type) {
    case ActionTypes.SetSelectedDate:
      return { ...state, selectedDate: action.payload as Dayjs };

    case ActionTypes.AdjustDateTime:
      const AdjustDateTimeAction = action as AdjustDateTimeAction;
      let newDate;

      if (AdjustDateTimeAction.increment) {
        newDate = state.selectedDate.add(1, AdjustDateTimeAction.unit);
      } else {
        newDate = state.selectedDate.subtract(1, AdjustDateTimeAction.unit);
      }

      return { ...state, selectedDate: newDate };

    case ActionTypes.ToggleAmPm:
      return {
        ...state,
        selectedDate:
          state.selectedDate.hour() >= 12
            ? state.selectedDate.subtract(12, "hour")
            : state.selectedDate.add(12, "hour"),
      };

    default:
      return state;
  }
};

export const useCalendar = (ISODate?: string) => {
  const initialState: CalendarState = useMemo(() => {
    return {
      selectedDate: dayjs(ISODate) || dayjs(),
    };
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectedDate } = state;

  const currentDay = useMemo(() => dayjs().toDate(), []);

  const modifyDateTime = (unit: TUnit, increment: boolean) => {
    dispatch({ type: ActionTypes.AdjustDateTime, unit, increment });
  };

  const toggleAmPm = () => {
    dispatch({ type: ActionTypes.ToggleAmPm });
  };

  const onDateChange = (date: Dayjs) => {
    dispatch({ type: ActionTypes.SetSelectedDate, payload: date });
  };

  const firstDayOfTheMonth = useMemo(() => selectedDate.clone().startOf("month"), [selectedDate]);

  const firstDayOfFirstWeekOfMonth = useMemo(() => dayjs(firstDayOfTheMonth).startOf("week"), [firstDayOfTheMonth]);

  const generateFirstDayOfEachWeek = useCallback((day: Dayjs): Dayjs[] => {
    const dates: Dayjs[] = [day];
    for (let i = 1; i < 6; i++) {
      const date = day.clone().add(i, "week");
      dates.push(date);
    }
    return dates;
  }, []);

  const generateWeek = useCallback((day: Dayjs): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = day.clone().add(i, "day").toDate();
      dates.push(date);
    }
    return dates;
  }, []);

  const generateWeeksOfTheMonth = useMemo((): Date[][] => {
    const firstDayOfEachWeek = generateFirstDayOfEachWeek(firstDayOfFirstWeekOfMonth);
    return firstDayOfEachWeek.map((date) => generateWeek(date));
  }, [generateFirstDayOfEachWeek, firstDayOfFirstWeekOfMonth, generateWeek]);

  return {
    selectedDate,
    currentDay,
    firstDayOfFirstWeekOfMonth,
    firstDayOfTheMonth,
    generateWeeksOfTheMonth,
    modifyDateTime,
    toggleAmPm,
    onDateChange,
    generateWeek,
    generateFirstDayOfEachWeek,
  };
};
