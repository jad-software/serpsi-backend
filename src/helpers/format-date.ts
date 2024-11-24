import { formatTime } from "./format-time";

/**
 * Formats a Date object into a string with the pattern "DD/MM/YYYY HH:mm"
 * @param date The Date object to format
 * @returns A string representation of the date in DD/MM/YYYY HH:mm format
 */
export function formatDate(date: Date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + formatTime(date);
}