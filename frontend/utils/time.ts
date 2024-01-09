import dayjs, { Dayjs } from "dayjs";

export const secondsToMilliseconds = (seconds: number) => seconds * 1000;
export const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;
export const hoursToMilliseconds = (hours: number) => hours * 60 * 60 * 1000;
export const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;
export const weeksToMilliseconds = (weeks: number) => weeks * 7 * 24 * 60 * 60 * 1000;
export const monthsToMilliseconds = (months: number) => months * 30 * 24 * 60 * 60 * 1000;
export const yearsToMilliseconds = (years: number) => years * 365 * 24 * 60 * 60 * 1000;

export const isDateExpired = (date: string | Dayjs) => dayjs().isAfter(dayjs(date));
