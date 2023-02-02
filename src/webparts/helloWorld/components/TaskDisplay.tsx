import { Stack } from "office-ui-fabric-react";
import * as React from "react";
import { getQuarterWeeks, getWeeks, isYearInDateRange } from "../helpers/dateMath";
import ITask from "../types/ITask";
import ITaskListFlex from "../types/ITaskListFlexProportions";
import styles from "../styles/List.module.scss";
import IYearQuarter from "../types/IQuarter";

export interface ITaskDisplayProps {
  task: ITask,
  yearQuarter: IYearQuarter,
  flex: ITaskListFlex
}

/**
 * Displays a table row to represent the task visually.
 * The task is visible depending on if it matches up with the given yearQuarter.
 * It must be externally aligned.
 */
const TaskDisplay = ({
  task,
  yearQuarter,
  flex
}: ITaskDisplayProps) => {

  const taskWeeks = getWeeks(task.startDate, task.endDate);

  // Determine if the task is in the current year. This is to avoid tasks showing in the same quarter but different year.
  // Even if task isnt in the year, cells are still generated cause empty cells have a visual style.
  
  const isTaskSameYear = isYearInDateRange(yearQuarter.year, task.startDate, task.endDate);

  // Generates one cell side by side for each week in the current quarter, and cells with tasks on them are highlighted.

  return (
    <Stack horizontal>
      {
      getQuarterWeeks(yearQuarter).map(week => {

        // if current week is same as any week that belongs to the task, then current week is a task week and should be highlighted.

        const isTaskSameWeek = taskWeeks.includes(week);

        return (
          <Stack
            styles={{ root: { flex: 1, outline: '1 px solid black' }}}
            className={isTaskSameYear && isTaskSameWeek ? styles.active : styles.inactive}
          >
            <p></p>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default TaskDisplay;
