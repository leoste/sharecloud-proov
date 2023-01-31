import * as React from 'react';
import { useState } from 'react';
import styles from './HelloWorld.module.scss';
import { DefaultButton, Stack, TooltipHost } from 'office-ui-fabric-react';
import * as strings from 'HelloWorldWebPartStrings';
import ITask from '../types/ITask';
import { areWeeksOverlapping, getLastQuarter, getMonthWeekCount, getNextQuarter, getQuarterMonths, getQuarterWeeks, getWeeks } from '../helpers/dateMath';

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

  const onClickLastQuarter = () => {
    const { year: lastYear, quarter: lastQuarter } = getLastQuarter(year, quarter);
    setQuarter(lastQuarter);
    setYear(lastYear);
  }

  const onClickNextQuarter = () => {
    const { year: nextYear, quarter: nextQuarter } = getNextQuarter(year, quarter);
    setQuarter(nextQuarter);
    setYear(nextYear);
  }

  const quarterWeeks = getQuarterWeeks(year, quarter);

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
            {getQuarterMonths(quarter).map(month => {
              return (<th colSpan={getMonthWeekCount(year, month)}>{new Date(year, month).toLocaleString('default', { month: 'long' })}</th>);
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

            const openTooltip = () => {
              setTooltipContent(task.name);
            };

            const closeTooltip = () => {
              setTooltipContent('')
            };

            return (
              <tr>
                {quarterWeeks.map(week => {
                  const hasTask = taskWeeks.includes(week);
                  return (<td
                    className={hasTask && styles.hasTask}
                    onMouseOver={hasTask ? openTooltip : closeTooltip}
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