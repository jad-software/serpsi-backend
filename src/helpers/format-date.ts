import { formatTime } from "./format-time";

export function formatDate(date: Date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + formatTime(date);
}