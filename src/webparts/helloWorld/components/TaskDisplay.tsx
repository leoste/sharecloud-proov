import { Stack } from "office-ui-fabric-react";
import * as React from "react";
import { areWeeksOverlapping, getQuarterWeeks, getWeeks, isYearInDateRange } from "../helpers/dateMath";
import ITask from "../types/ITask";
import ITaskListFlex from "../types/ITaskListProportions";
import styles from "../styles/List.module.scss";

export interface ITaskDisplayProps {
  task: ITask,
  year: number,
  quarter: number,
  flex: ITaskListFlex
}

const TaskDisplay = ({
  task,
  year,
  quarter,
  flex
}: ITaskDisplayProps) => {

  const taskWeeks = getWeeks(task.startDate, task.endDate);

  const quarterWeeks = getQuarterWeeks(year, quarter);

  const isTaskInQuarter = 
    areWeeksOverlapping(taskWeeks, quarterWeeks) &&
    isYearInDateRange(year, task.startDate, task.endDate);

  return (
    <Stack horizontal>
      {
      quarterWeeks.map(week => {

        const hasTask = taskWeeks.includes(week);

        return (
          <Stack
            styles={{ root: { flex: 1, outline: '1 px solid black' }}}
            className={isTaskInQuarter && hasTask ? styles.active : styles.inactive}
          >
            <p></p>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default TaskDisplay;
