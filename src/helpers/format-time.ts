export function formatTime(time: Date) {
  return (time.getUTCHours() < 10 ? '0' + time.getUTCHours() : time.getUTCHours())
    + ':'
    + (time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes())
    + ':'
    + (time.getUTCSeconds() < 10 ? '0' + time.getUTCSeconds() : time.getUTCSeconds());
}