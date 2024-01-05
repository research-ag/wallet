import dayjs from "dayjs";

export function formatDateTime(date: string) {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}
