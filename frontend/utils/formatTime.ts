import moment from "moment";

export function momentDateTime(date: string) {
  return moment(date).format("DD/MM/YYYY HH:mm");
}
