import { addWeeks, DayOfWeek, getWeekNumber, getWeekNumbersInMonth } from 'office-ui-fabric-react';
import { FirstWeekOfYear as OfficeFirstWeekOfYear } from 'office-ui-fabric-react';

export const FirstWeekOfYear = OfficeFirstWeekOfYear.FirstFourDayWeek;
export const FirstDayOfWeek = DayOfWeek.Monday;

export const getLastQuarter = (year: number, quarter: number): { year: number, quarter: number } => {
  quarter--;
  if (quarter < 1) {
    quarter = 4;
    year--;
  }
  return { year, quarter };
}

export const getNextQuarter = (year: number, quarter: number): { year: number, quarter: number } => {
  quarter++;
  if (quarter > 4) {
    quarter = 1;
    year++;
  }
  return { year, quarter };
}

export const getQuarterMonths = (quarter: number): number[] => {
  const months = [];
  for (let i = 0; i < 3; i++) {
    months.push((quarter - 1) * 3 + i);
  }
  return months;
}

export const getQuarterWeeks = (year: number, quarter: number): number[] => {
  const weeks: number[] = [];
  const months = getQuarterMonths(quarter);
  months.forEach(month => {
    const weekNumbers = getWeeksInMonth(year, month);
    weekNumbers.forEach(weekNumber => weeks.push(weekNumber));
  })
  return weeks;
}

export const getMonthDate = (year: number, month: number): Date => {
  return new Date(year, month);
}

export const getWeeksInMonth = (year: number, month: number): number[] => {
  return getWeekNumbersInMonth(5, FirstDayOfWeek, FirstWeekOfYear, getMonthDate(year, month))
}

export const getMonthWeekCount = (year: number, month: number): number => {
  const weeks = getWeeksInMonth(year, month);
  return weeks.length;
}

export const getWeeks = (startDate: Date, endDate: Date): number[] => {
  const weeks = [];

  const endWeek = getWeekNumber(endDate, FirstDayOfWeek, FirstWeekOfYear);

  let date = new Date(startDate.getTime());
  let week: number;

  do {
    week = getWeekNumber(date, FirstDayOfWeek, FirstWeekOfYear)
    weeks.push(week);
    date = addWeeks(date, 1);
  }
  while (week !== endWeek);

  return weeks;
}

export const areWeeksOverlapping = (weekNumbers: number[], otherWeekNumbers: number[]): boolean => {

  return weekNumbers.some(weekNumber => otherWeekNumbers.includes(weekNumber));
}