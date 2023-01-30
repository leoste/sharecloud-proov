import * as React from 'react';
import { useState } from 'react';
import styles from './HelloWorld.module.scss';
import { addWeeks, DefaultButton, getWeekNumber, getWeekNumbersInMonth, Stack, TooltipHost } from 'office-ui-fabric-react';
import * as strings from 'HelloWorldWebPartStrings';
import { FirstDayOfWeek, FirstWeekOfYear } from '../helpers/constants';
import ITask from '../types/ITask';

export interface IQuarter {
  year: number;
  q: number
}

export interface IHelloWorldProps {
  tasks: ITask[]
}

const TasksTable = ({
  tasks
}: IHelloWorldProps) => {

  const now = new Date();

  const [year, setYear] = useState<number>(now.getFullYear());
  const [quarter, setQuarter] = useState<number>(Math.floor((now.getMonth() + 3) / 3));

  const [tooltipContent, setTooltipContent] = useState<string>('');

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

  const areWeeksOverlapping = (weekNumbers: number[], otherWeekNumbers: number[]): boolean => {

    return weekNumbers.some(weekNumber => otherWeekNumbers.includes(weekNumber));
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

  return (
    <Stack horizontalAlign='center' className={styles.wideStack}>
      <Stack horizontal verticalAlign='center' horizontalAlign='space-around' className={styles.wideStack}>
        <DefaultButton onClick={onClickLastQuarter}>{strings.LastQuarter}</DefaultButton>
        <h1>{year} Q{quarter}</h1>
        <DefaultButton onClick={onClickNextQuarter}>{strings.NextQuarter}</DefaultButton>
      </Stack>


      <TooltipHost
        content={tooltipContent}
        styles={{ root: { display: 'inline-block' } }}
      >
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
            const taskWeeks = getWeeks(task.startDate, task.endDate);

            return (
              <tr>
                {quarterWeeks.map(week => {
                  const hasTask = taskWeeks.includes(week);
                  return (<td
                    className={hasTask && styles.hasTask}
                    onMouseOver={hasTask && (() => {
                      setTooltipContent(task.name);
                    })}
                    onMouseOut={hasTask && (() => {
                      setTooltipContent('')
                    })}
                    />)
                })}
              </tr>
            );
          })}
        </table>
      </TooltipHost>
    </Stack>
  );
}

export default TasksTable;