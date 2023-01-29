import * as React from 'react';
import { useState } from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface IQuarter {
  year: number;
  q: number
}

export interface ITask {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface IWeekRange {
  startWeek: number,
  endWeek: number
}

const HelloWorld = ({
  description,
  isDarkTheme,
  environmentMessage,
  hasTeamsContext,
  userDisplayName
}: IHelloWorldProps) => {

  const now = new Date();
  const msInOneDay = 24 * 60 * 60 * 1000;

  const [year, setYear] = useState<number>(now.getFullYear());
  const [quarter, setQuarter] = useState<number>(Math.floor((now.getMonth() + 3) / 3))

  const januaryFirst = new Date(year, 0, 1);

  const getQuarterMonths = (): number[] => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      months.push((quarter - 1) * 3 + i);
    }
    return months;

    setQuarter(4);
  }

  const getFirstDateOfMonth = (month: number): Date => {
    return new Date(year, month, 1);

    setYear(0);
  }

  const getLastDateOfMonth = (month: number): Date => {
    return new Date(year, month + 1, 0);
  }

  /**
   * 
   * @param day day number 0-6, where 0 equals Sunday and 6 equals Saturday
   * @returns number 0-6, where 0 equals Monday and 6 equals Sunday
   */
  const correctDay = (day: number): number => {
    return day === 0 ? 6 : day - 1;
  }

  const getDateByDayOfSameWeek = (date: Date, day: number): Date => {
    // default weekday in Date object starts from sunday. for accurate calculations, correct data

    const correctedDateDay = correctDay(date.getDay());
    const correctedDay = correctDay(day);
    const newDate = new Date(date.getTime() + msInOneDay * (correctedDay - correctedDateDay));
    return newDate;
  }

  const isDateWeekThursdaySameMonth = (date: Date): boolean => {
    const thursday = getDateByDayOfSameWeek(date, 4);
    return date.getMonth() === thursday.getMonth();
  }

  const getDayCountOfDate = (date: Date): number => {
    return Math.floor((date.getTime() - januaryFirst.getTime()) / msInOneDay);
  }

  const getDateWeek = (date: Date): number => {
    // ISO standard says that the week belongs to the month that has most days.
    // The month that has the thursday of the week has most of the days of that week.

    const yearDayCount = getDayCountOfDate(date);
    const weekDayCount = correctDay(januaryFirst.getDay());
    const dayCount = yearDayCount + weekDayCount;
    const week = (Math.ceil(dayCount / 7)) - (isDateWeekThursdaySameMonth(januaryFirst) ? 0 : 1);

    console.log(date, yearDayCount, dayCount, '|', Math.ceil(dayCount / 7));

    return week;
  }

  const getWeekRange = (startDate: Date, endDate: Date): IWeekRange => {
    const startWeek = getDateWeek(startDate);
    const endWeek = getDateWeek(endDate);
    return { startWeek, endWeek }
  }

  // TODO: fix bug, sometimes there are too few weeks, sometimes too many

  const getMonthWeekRange = (month: number): IWeekRange => {
    const firstDateOfMonth = getFirstDateOfMonth(month);
    const lastDateOfMonth = getLastDateOfMonth(month);

    let weekRange = getWeekRange(firstDateOfMonth, lastDateOfMonth);

    //console.log('1) -------------------------------', month, weekRange.startWeek, weekRange.endWeek);

    if (!isDateWeekThursdaySameMonth(firstDateOfMonth)) weekRange.startWeek++;
    if (!isDateWeekThursdaySameMonth(lastDateOfMonth)) weekRange.endWeek--;

    //console.log('2) -------------------------------', month, weekRange.startWeek, weekRange.endWeek);

    return weekRange;
  }

  const getMonthWeekCount = (month: number): number => {
    const monthWeekRange = getMonthWeekRange(month);

    return monthWeekRange.endWeek - monthWeekRange.startWeek + 1;
  }

  const isWeekInRange = (week: number, weekRange: IWeekRange): boolean => {
    return week >+ weekRange.startWeek  && week <= weekRange.endWeek
  }

  const areWeekRangesOverlapping = (oneWeekRange: IWeekRange, otherWeekRange: IWeekRange): boolean => {
    return isWeekInRange(oneWeekRange.startWeek, otherWeekRange) || isWeekInRange(oneWeekRange.endWeek, otherWeekRange);
  }

  const getQuarterWeeks = (): number[] => {
    const weeks: number[] = [];
    const months = getQuarterMonths();
    months.forEach(month => {
      const weekRange = getMonthWeekRange(month);
      for (let i = weekRange.startWeek; i <= weekRange.endWeek; i++) {
        weeks.push(i);
      }
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

  const tasks: ITask[] = [
    {
      name: 'task 1',
      startDate: new Date(2023, 0, 23),
      endDate: new Date(2023, 0, 27)
    },
    {
      name: 'task 2',
      startDate: new Date(2023, 1, 21),
      endDate: new Date(2023, 2, 3)
    },
    {
      name: 'task 3',
      startDate: new Date(2023, 0, 30),
      endDate: new Date(2023, 2, 20)
    }
  ];

  const quarterWeeks = getQuarterWeeks();

  const renderTd = (colSpan: number, blue: boolean = false) => {
    if (colSpan > 0) return (<td colSpan={colSpan}>{blue ? 'blue' : ''}</td>)
    else return (<></>);
  }

  // TODO: instead of task => true, check if task is within current quarter, otherwise dont include
  return (
    <>
      <h1>{year} Q{quarter}</h1>
      <table className={styles.quarterTable}>
        <tr>
          {getQuarterMonths().map(month => {
            return (<th colSpan={getMonthWeekCount(month)}>{new Date(year, month).toLocaleString('default', { month: 'long'})}</th>);
          })}
        </tr>
        <tr>
          {quarterWeeks.map(week => {
            return (<th>{week}</th>)
          })}
        </tr>
        {tasks.filter(task => {
          return areWeekRangesOverlapping(
            getWeekRange(task.startDate, task.endDate),
            { startWeek: quarterWeeks[0], endWeek: quarterWeeks[quarterWeeks.length - 1]}
          );
        }).map(task => {
          const { startWeek, endWeek } = getWeekRange(task.startDate, task.endDate);

          return (
            <tr>              
              {renderTd(startWeek - quarterWeeks[0])}
              {renderTd(endWeek - startWeek + 1, true)}
              {renderTd(quarterWeeks[quarterWeeks[quarterWeeks.length - 1] - endWeek])}
            </tr>
          );
        })}
      </table>

      <button onClick={onClickLastQuarter}>Eelmine kvartal</button>
      <button onClick={onClickNextQuarter}>Järgmine kvartal</button>

      <section className={`${styles.helloWorld} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default HelloWorld;