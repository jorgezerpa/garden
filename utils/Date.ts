import { startOfWeek, endOfWeek, format, parseISO, eachDayOfInterval, getMonth, getDate } from 'date-fns';

/**
 * Calculates the Monday of the week for a given date.
 * @param baseDate - ISO string or Date object
 * @returns string formatted as 'yyyy-MM-dd'
 */
export const calculateMondayOfTheWeek = (baseDate: string | Date): string => {
  const date = typeof baseDate === 'string' ? parseISO(baseDate) : baseDate;
  
  // weekStartsOn: 1 ensures Monday is the first day of the week
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  
  return format(monday, 'yyyy-MM-dd');
};

/**
 * Calculates the Sunday of the week for a given date.
 * @param baseDate - ISO string or Date object
 * @returns string formatted as 'yyyy-MM-dd'
 */
export const calculateSundayOfTheWeek = (baseDate: string | Date): string => {
  const date = typeof baseDate === 'string' ? parseISO(baseDate) : baseDate;
  
  // We calculate Sunday based on the Monday of that week to be safe
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });
  
  return format(sunday, 'yyyy-MM-dd');
};


// Define a type for the subarray: [ISO Date, Month, Day, DayName]
export type WeekDayTuple = [string, number, number, string];

export const getWeekDaysCardsData = (selectedDate: string): WeekDayTuple[] => {
  // parseISO treats '2023-10-23' as a local date, avoiding the UTC shift bug
  const baseDate = parseISO(selectedDate);
  
  // Ensure we start the week on Monday (1)
  const monday = startOfWeek(baseDate, { weekStartsOn: 1 });
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: monday, end: sunday });

  return days.map((day): WeekDayTuple => [
    format(day, 'yyyy-MM-dd'),         // "2023-10-23"
    getMonth(day) + 1,                // 10 (Human readable month)
    getDate(day),                     // 23
    format(day, 'eee').toLowerCase(), // "mon"
  ]);
};
