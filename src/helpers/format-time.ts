/**
 * Formats a Date object into a string representation of time in UTC format (HH:MM:SS)
 * Ensures that hours, minutes and seconds are padded with leading zeros when needed
 * @param time - The Date object to format
 * @returns A string in the format "HH:MM:SS" using UTC time
 */
export function formatTime(time: Date) {
  return (time.getUTCHours() < 10 ? '0' + time.getUTCHours() : time.getUTCHours())
    + ':'
    + (time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes())
    + ':'
    + (time.getUTCSeconds() < 10 ? '0' + time.getUTCSeconds() : time.getUTCSeconds());
}
