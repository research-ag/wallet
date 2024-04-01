import dayjs from "dayjs";

export function formatDateTime(date: string, format = "MM/DD/YYYY HH:mm") {
  return dayjs(date).format(format);
}

export function getElapsedSecond(init: Date, end: Date) {
  const elapsed = end.valueOf() - init.valueOf();
  return (elapsed / 1000).toString();
}
