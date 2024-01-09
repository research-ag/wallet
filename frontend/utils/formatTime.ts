import dayjs from "dayjs";

export function formatDateTime(date: string, format = "DD/MM/YYYY HH:mm") {
  return dayjs(date).format(format);
}
