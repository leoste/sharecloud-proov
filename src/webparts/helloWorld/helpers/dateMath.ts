import { addWeeks, DayOfWeek, getMonthEnd, getMonthStart, getStartDateOfWeek, getWeekNumber } from 'office-ui-fabric-react';
import { FirstWeekOfYear as OfficeFirstWeekOfYear } from 'office-ui-fabric-react';
import IYearQuarter from '../types/IQuarter';

/**
 * This FirstWeekOfYear value should be used when prompted for one, in order to display the results consistently.
 */
export const FirstWeekOfYear = OfficeFirstWeekOfYear.FirstFourDayWeek;

/**
 * This FirstDayOfWeek value should be used when prompted for one, in order to display the results consistently.
 */
export const FirstDayOfWeek = DayOfWeek.Monday;

const msInOneDay = 1000 * 60 * 60 * 24;
const monthsInOneQuarter = 3;
const indexOfFirstQuarter = 1;
const indexOfLastQuarter = 4;

/**
 * Returns the IYearQuarter that is one quarter before the given IYearQuarter.
 * @param yearQuarter The basis yearQuarter.
 * @returns A new IYearQuarter object
 */
export const getLastYearQuarter = (yearQuarter: IYearQuarter): IYearQuarter => {

  let year = yearQuarter.year;
  let quarter = yearQuarter.quarter;

  // Subtract one and the answer is almost there.
  // But, can't go below 1st quarter, so then need to go back a year and go to the last quarter of that year.

  quarter--;
  if (quarter < indexOfFirstQuarter) {
    quarter = indexOfLastQuarter;
    year--;
  }
  return { year, quarter };
}

/**
 * Returns the IYearQuarter that is one quarter after the givenIYearQuarter.
 * @param yearQuarter The basis yearQuarter.
 * @returns A new IYearQuarter object
 */
export const getNextYearQuarter = (yearQuarter: IYearQuarter): IYearQuarter => {

  let year = yearQuarter.year;
  let quarter = yearQuarter.quarter;

  // Add one and the answer is almost there.
  // But, can't go above 4th quarter, so then need to go up one year and the first quarter of that year.

  quarter++;
  if (quarter > indexOfLastQuarter) {
    quarter = indexOfFirstQuarter;
    year++;
  }
  return { year, quarter };
}

/**
 * Returns the quarter number, which includes the given month.
 * @param month a number representing the month to get the corresponding quarter of.
 * @returns a number representing the quarter.
 */
export const getQuarterFromMonth = (month: number): number => {

  // Dividing the month number by the number of months in one quarter gives the right answer.
  // Adding monthsInOneQuarter before dividing ensures that the numbers go 1-4 not 0-3.

  return Math.floor((month + monthsInOneQuarter) / monthsInOneQuarter);
}

/**
 * Returns an IYearQuarter object from the given date, using the year and month of the date.
 * @param date Date to get aIYearQuarter object from.
 * @returns a newIYearQuarter object.
 */
export const getYearQuarterFromDate = (date: Date): IYearQuarter => {
  return {
    year: date.getFullYear(),
    quarter: getQuarterFromMonth(date.getMonth())
  };
}

/**
 * Returns an array of all months belonging to the given quarter.
 * @param quarter a number representing the quarter to get the months for.
 * @returns an array of month numbers.
 */
export const getQuarterMonths = (quarter: number): number[] => {

  // The loop runs for how many months there are in one quarter.
  // Multiplying the quarter number by the amount of months in one quarter gives the number of the first month.
  // Before multiplying, the index of the first quarter needs to be subtracted to target the right months.
  // Adding the loop index to the calculated number allows to get the following months.

  const months = [];
  for (let i = 0; i < monthsInOneQuarter; i++) {
    months.push((quarter - indexOfFirstQuarter) * monthsInOneQuarter + i);
  }
  return months;
}

/**
 * Returns an array of all weeks belonging to the given quarter.
 * @param yearQuarter an IYearQuarter object to get the weeks for.
 * @returns an array of week numbers.
 */
export const getQuarterWeeks = (yearQuarter: IYearQuarter): number[] => {

  // First get the quarter months, then get the weeks of each month and add them all to one array.
  // The resulting array is a list of all weeks belonging to this quarter.

  const weeks: number[] = [];
  const months = getQuarterMonths(yearQuarter.quarter);
  months.forEach(month => {
    const weekNumbers = getWeeksInMonth(yearQuarter.year, month);
    weekNumbers.forEach(weekNumber => weeks.push(weekNumber));
  })
  return weeks;
}

/**
 * Returns a date object in the specified month and year.
 * @param year year of the date
 * @param month month of the date
 * @returns a new Date object.
 */
export const getMonthDate = (year: number, month: number): Date => {
  return new Date(year, month);
}

export const getDaysPassed = (firstDate: Date, secondDate: Date): number => {

  // Convert both dates to ms in order to make it a simple subtraction.
  // Finally divide by the count of ms in one day and result is the count of days from first to second date.

  const timeDifference = secondDate.getTime() - firstDate.getTime();
  const dayDifference = timeDifference / msInOneDay;
  return dayDifference;
}

/**
 * Returns a list of all of the weeks in the given month.
 * A week is considered to be a part of a month, if
 * most of the days of the week are a part of the month.
 */
export const getWeeksInMonth = (year: number, month: number): number[] => {

  const date = new Date(year, month);

  // The start of the week is the monday of the week that the first of the month is on.

  const first = getMonthStart(date);
  const firstMonday = getStartDateOfWeek(first, FirstDayOfWeek);

  // To check if most of the days of that week fall in the same month
  // you can count days passed since monday to the 1st of the month.
  // If 4 or more days have passed, that means that there are
  // only 3 or less days since 1st of the month to the end of the week,
  // and the week is not a part of this month.

  // countingDate is used to count weeks to the last week.
  // If the week with the 1st of month is not this months week, then
  // add 1 week to the date to skip it.

  let firstMondayOfMonth = new Date(firstMonday.getTime());
  if (getDaysPassed(firstMonday, first) >= 4) {
    firstMondayOfMonth = addWeeks(firstMondayOfMonth, 1);
  }

  // Similar logic is used to determine the last week of the month.
  
  const last = getMonthEnd(date);
  const lastMonday = getStartDateOfWeek(last, FirstDayOfWeek);

  // If 2 or less days have passed from last monday to the last date of the month, then
  // 4 or more days belong to the next week, therefore the week is not a part of this month.
  // In this case, set the target back one week.
  
  let lastMondayOfMonth = new Date(lastMonday.getTime());
  if (getDaysPassed(lastMonday, last) <= 2) {
    lastMondayOfMonth = addWeeks(lastMondayOfMonth, -1);
  }

  // A list of all the weeks between the first and last monday of the month
  // is a list of all the weeks of the month.

  return getWeeks(firstMondayOfMonth, lastMondayOfMonth);
}

export const getMonthWeekCount = (year: number, month: number): number => {

  // Just counting the length of the array of all weeks in the month is a simple way to do it.

  const weeks = getWeeksInMonth(year, month);
  return weeks.length;
}

/**
 * Returns a list of all weeks between the start and end dates, including the start and end dates.
 * If the start and end date are a part of the same week, that week gets included.
 */
export const getWeeks = (startDate: Date, endDate: Date): number[] => {

  const weeks = [];

  // The idea is to start from the starting date and keep adding 1 week to a temporary date.
  // Every time the week of that date is pushed into the week array.
  // And finally, the array of weeks will contain all weeks that are between these two dates.

  // endWeek is the last week that will get included in the array.

  const endWeek = getWeekNumber(endDate, FirstDayOfWeek, FirstWeekOfYear);

  let date = new Date(startDate.getTime());
  let week: number;

  // do while instead of do means that endWeek is inclusive not exclusive and
  // the last week still gets included.
  // There is always at least one week between two dates, cause
  // the dates have to be a part of some week themselves.

  do {
    week = getWeekNumber(date, FirstDayOfWeek, FirstWeekOfYear)
    weeks.push(week);
    date = addWeeks(date, 1);
  }
  while (week !== endWeek);

  return weeks;
}

/**
 * Returns whether the two given week ranges are overlapping.
 * @param weekNumbers an array containing a continuous range of week numbers
 * @param otherWeekNumbers an array containing a continuous range of week numbers
 * @returns a boolean value.
 */
export const areWeeksOverlapping = (weekNumbers: number[], otherWeekNumbers: number[]): boolean => {

  // if any weekNumber from the first list is found in the second list, that means they are overlapping.

  // The reason i can't just compare first and last members, although it would be logical to do, is that
  // sometimes the array might start from the end of the year for example, and then
  // the first weekNumber could be bigger than the last one.
  // In these cases that calculation would not work properly.

  return weekNumbers.some(weekNumber => otherWeekNumbers.includes(weekNumber));
}

export const isYearInDateRange = (year: number, startDate: Date, endDate: Date) => {
  return year >= startDate.getFullYear() && year <= endDate.getFullYear();
}