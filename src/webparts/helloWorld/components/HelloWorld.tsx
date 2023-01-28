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
  
  const getCurrentWeekThursday = (date: Date): Date => {
    const day = date.getDay();
    const correctedDay = day === 0 ? 6 : day - 1;
    const lastThursday = new Date(date.getTime() + msInOneDay * (3 - correctedDay));
    return lastThursday;
  }

  const isCurrentWeekThursdaySameMonth = (date: Date): boolean => {
    return date.getMonth() === getCurrentWeekThursday(date).getMonth();
  }

  const getMonthWeekCount = (month: number): number => {
    const firstDateOfMonth = getFirstDateOfMonth(month);
    const lastDateOfMonth = getLastDateOfMonth(month);
    const weekOfFirstDateOfMonth = getDateWeek(firstDateOfMonth);
    const weekOfLastDateOfMonth = getDateWeek(lastDateOfMonth);

    let weekCount = weekOfLastDateOfMonth - weekOfFirstDateOfMonth;

    if (isCurrentWeekThursdaySameMonth(firstDateOfMonth)) weekCount++;
    if (!isCurrentWeekThursdaySameMonth(lastDateOfMonth)) weekCount--;

    return weekCount;
  }

  const getDayCountOfDate = (date: Date): number => {
    return Math.floor((date.getTime() - januaryFirst.getTime()) / msInOneDay);
  }

  // TODO: implement iso standard for week (first week of year starts from thursday)

  const getDateWeek = (date: Date): number => {
    // ISO standard says that the week belongs to the month that has most days.
    // The month that has the thursday of the week has most of the days of that week.

    const dayCount = getDayCountOfDate(date);
    const week = (Math.ceil(dayCount / 7)) + (isCurrentWeekThursdaySameMonth(januaryFirst) ? 1 : 0);

    return week;
  }

  const getWeekRange = (startDate: Date, endDate: Date): IWeekRange => {
    const startWeek = getDateWeek(startDate);
    const endWeek = getDateWeek(endDate);
    return { startWeek, endWeek }
  }

  const getQuarterWeeks = (): number[] => {
    const weeks = [];
    const months = getQuarterMonths();
    const { startWeek, endWeek } = getWeekRange(getFirstDateOfMonth(months[0]), getLastDateOfMonth(months[2]));
    for (let i = startWeek; i < endWeek; i++) {
      weeks.push(i);
    }
    return weeks;
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

  /*const getRelativeDateByMonths = (date: Date, months: number): Date => {
    const relativeDate = new Date(date.getTime());
    relativeDate.setMonth(relativeDate.getMonth() + months);
    return relativeDate;
  }*/

  const quarterWeeks = getQuarterWeeks();

  return (
    <>
      <table className={styles.quarterTable}>
        <tr>
          {getQuarterMonths().map(month => {
            return (<th colSpan={getMonthWeekCount(month)}>{month}</th>);
          })}
        </tr>
        <tr>
          {quarterWeeks.map(week => {
            return (<th>{week}</th>)
          })}
        </tr>
        {tasks.map(task => {
          const { startWeek, endWeek } = getWeekRange(task.startDate, task.endDate);

          return (
            <tr>
              <td colSpan={startWeek - quarterWeeks[0]}></td>
              <td colSpan={endWeek - startWeek + 1}>blue</td>
            </tr>
          );
        })}
      </table>

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