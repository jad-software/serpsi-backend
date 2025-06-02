/**
 * Formats a Date object into a string representation of time in  format (HH:MM:SS)
 * Ensures that hours, minutes and seconds are padded with leading zeros when needed
 * @param time - The Date object to format
 * @returns A string in the format "HH:MM:SS" using time
 */
export function formatTime(time: Date) {
  return (time.getHours() < 10 ? '0' + time.getHours() : time.getHours())
    + ':'
    + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())
    + ':'
    + (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
}
