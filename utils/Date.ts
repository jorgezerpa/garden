import { startOfWeek, endOfWeek, format, parseISO, eachDayOfInterval, getMonth, getDate } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

const IANA = "Europe/Amsterdam";

/**
 * Helper to ensure a date is treated as being in the target IANA zone.
 */
const getZonedDate = (baseDate: string | Date): Date => {
  return toDate(baseDate, { timeZone: IANA });
};

export const calculateMondayOfTheWeek = (baseDate: string | Date): string => {
  const zonedDate = getZonedDate(baseDate);
  const monday = startOfWeek(zonedDate, { weekStartsOn: 1 });
  
  // Use formatInTimeZone to ensure the string representation matches Amsterdam
  return formatInTimeZone(monday, IANA, 'yyyy-MM-dd');
};

export const calculateSundayOfTheWeek = (baseDate: string | Date): string => {
  const zonedDate = getZonedDate(baseDate);
  const monday = startOfWeek(zonedDate, { weekStartsOn: 1 });
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });
  
  return formatInTimeZone(sunday, IANA, 'yyyy-MM-dd');
};

export type WeekDayTuple = [string, number, number, string];

export const getWeekDaysCardsData = (selectedDate: string): WeekDayTuple[] => {
  const zonedDate = getZonedDate(selectedDate);
  const monday = startOfWeek(zonedDate, { weekStartsOn: 1 });
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: monday, end: sunday });

  return days.map((day): WeekDayTuple => [
    formatInTimeZone(day, IANA, 'yyyy-MM-dd'),
    getMonth(day) + 1,
    getDate(day),
    formatInTimeZone(day, IANA, 'eee').toLowerCase(),
  ]);
};

export const getCurrentDay = (): string => {
  return formatInTimeZone(new Date(), IANA, 'yyyy-MM-dd');
};

/**
 * Returns the UTC ISO string for the start of the day in Amsterdam.
 * If IANA is UTC+1, '2024-05-20' -> '2024-05-19T23:00:00.000Z'
 */
export const getUTCISOStringStartOfDay = (yymmdd: string): string => {
  // We tell toDate: "This string represents midnight in Amsterdam"
  const zonedDate = toDate(`${yymmdd}T00:00:00`, { timeZone: IANA });
  return zonedDate.toISOString(); 
}

/**
 * Returns the UTC ISO string for the end of the day in Amsterdam.
 */
export const getUTCISOStringEndOfDay = (yymmdd: string): string => {
  const zonedDate = toDate(`${yymmdd}T23:59:59.999`, { timeZone: IANA });
  return zonedDate.toISOString();
}

/**
 * Converts minutes into a "00h 00m" formatted string.
 * @param totalMinutes - The total duration in minutes
 * @returns Formatted string (e.g., "02h 15m")
 */
export const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // .padStart(2, '0') ensures we always have two digits (e.g., "05" instead of "5")
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMins = String(mins).padStart(2, '0');

  return `${paddedHours}h ${paddedMins}m`;
};

// Examples:
// console.log(formatMinutes(135)); // "02h 15m"
// console.log(formatMinutes(45));  // "00h 45m"
// console.log(formatMinutes(600)); // "10h 00m"