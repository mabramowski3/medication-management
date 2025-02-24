/**
 * 
 * @returns returns today's date(in local time) as a string in yyyy-MM-dd format
 */
export function todayDateString() {
  const now = new Date();
  return new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
    .toISOString()
    .split("T")[0];
}