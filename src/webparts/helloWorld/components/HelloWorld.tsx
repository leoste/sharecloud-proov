import * as React from 'react';
import { useState } from 'react';
import styles from './HelloWorld.module.scss';
import { addWeeks, DefaultButton, getWeekNumber, getWeekNumbersInMonth } from 'office-ui-fabric-react';
import * as strings from 'HelloWorldWebPartStrings';
import { FirstDayOfWeek, FirstWeekOfYear } from '../helpers/constants';
import ITask from '../types/ITask';

export interface IQuarter {
  year: number;
  q: number
}

export interface IHelloWorldProps {
  
}

const HelloWorld = ({

}: IHelloWorldProps) => {

  const now = new Date();

  const [year, setYear] = useState<number>(now.getFullYear());
  const [quarter, setQuarter] = useState<number>(Math.floor((now.getMonth() + 3) / 3));

  const [tasks, setTasks] = useState<ITask[]>([]);
  setTasks([]);

  const getQuarterMonths = (): number[] => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      months.push((quarter - 1) * 3 + i);
    }
    return months;
  }

  const getMonthDate = (month: number): Date => {
    return new Date(year, month);
  }

  const getWeeksInMonth = (month: number): number[] => {
    return getWeekNumbersInMonth(5, FirstDayOfWeek, FirstWeekOfYear, getMonthDate(month))
  }

  const getMonthWeekCount = (month: number): number => {
    const weeks = getWeeksInMonth(month);
    return weeks.length;
  }

  const getWeeks = (startDate: Date, endDate: Date): number[] => {
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

  const isWeekInWeeks = (week: number, weekNumbers: number[]): boolean => {
    return weekNumbers.includes(week);
  }

  const areWeeksOverlapping = (weekNumbers: number[], otherWeekNumbers: number[]): boolean => {
    return isWeekInWeeks(weekNumbers[0], otherWeekNumbers)
      || isWeekInWeeks(weekNumbers[weekNumbers.length - 1], otherWeekNumbers);
  }

  const getQuarterWeeks = (): number[] => {
    const weeks: number[] = [];
    const months = getQuarterMonths();
    months.forEach(month => {
      const weekNumbers = getWeeksInMonth(month);
      weekNumbers.forEach(weekNumber => weeks.push(weekNumber));
    })
    return weeks;
  }

  // TODO: universal function for adding/removing quarter

  const onClickLastQuarter = () => {
    let nextQuarter = quarter - 1;
    let nextYear = year;
    if (nextQuarter < 1) {
      nextQuarter = 4;
      nextYear--;
    }
    setQuarter(nextQuarter);
    setYear(nextYear);
  }

  const onClickNextQuarter = () => {
    let nextQuarter = quarter + 1;
    let nextYear = year;
    if (nextQuarter > 4) {
      nextQuarter = 1;
      nextYear++;
    }
    setQuarter(nextQuarter);
    setYear(nextYear);
  }

  const quarterWeeks = getQuarterWeeks();

  const renderTd = (count: number, hasTask: boolean = false) => {
    const elements = [];

    for (let i = 0; i < count; i++) {
      elements.push(<td
        className={hasTask && styles.hasTask}
        onMouseOver={hasTask && (() => {

        })} />);
    }

    return (elements)
  }

  // TODO: instead of task => true, check if task is within current quarter, otherwise dont include
  return (
    <>
      <h1>{year} Q{quarter}</h1>

      <DefaultButton onClick={onClickLastQuarter}>{strings.LastQuarter}</DefaultButton>
      <DefaultButton onClick={onClickNextQuarter}>{strings.NextQuarter}</DefaultButton>

      <table className={styles.quarterTable}>
        <tr>
          {getQuarterMonths().map(month => {
            return (<th colSpan={getMonthWeekCount(month)}>{new Date(year, month).toLocaleString('default', { month: 'long' })}</th>);
          })}
        </tr>
        <tr>
          {quarterWeeks.map(week => {
            return (<th>{week}</th>)
          })}
        </tr>
        {tasks.filter(task => {
          const weeks = getWeeks(task.startDate, task.endDate);

          const weeksOverlapping = areWeeksOverlapping(weeks, quarterWeeks);
          const yearsOverlapping = task.startDate.getFullYear() === year || task.endDate.getFullYear() === year;

          return weeksOverlapping && yearsOverlapping;
        }).map(task => {
          const weeks = getWeeks(task.startDate, task.endDate);

          const startWeek = weeks[0];
          const endWeek = weeks[weeks.length - 1];

          return (
            <tr>
              {
                (() => {

                })()
              }
              {renderTd(quarterWeeks.indexOf(startWeek))}
              {renderTd(quarterWeeks.indexOf(endWeek) - quarterWeeks.indexOf(startWeek) + 1, true)}
              {renderTd(quarterWeeks.indexOf(quarterWeeks[quarterWeeks.length - 1]) - quarterWeeks.indexOf(endWeek))}
            </tr>
          );
        })}
      </table>
    </>
  );
}

export default HelloWorld;