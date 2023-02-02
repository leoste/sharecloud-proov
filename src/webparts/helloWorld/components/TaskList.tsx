import * as strings from "HelloWorldWebPartStrings";
import { DefaultButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { MaxTasks } from "../helpers/constants";
import { getLastYearQuarter, getNextYearQuarter, getYearQuarterFromDate } from "../helpers/dateMath";
import styles from "../styles/Stack.module.scss";
import IYearQuarter from "../types/IQuarter";
import ITask from "../types/ITask";
import ITaskListFlexProportions from "../types/ITaskListFlexProportions";
import TaskRow from "./TaskRow";
import TaskRowHeader from "./TaskRowHeader";

export interface ITaskListProps {
  tasks?: ITask[],
  onTasksChange?: (tasks: ITask[]) => void
}

// Default flex proportions for the component and sub-components.
// It is passed along to sub-components to ensure consistent proportions.

const flex: ITaskListFlexProportions = {
  leftFlex: 1,
  middleFlex: 5,
  middle: {
    nameFlex: 3,
    startDateFlex: 2,
    endDateFlex: 2
  },
  rightFlex: 6,
  middleMargin: 32
}

/**
 * Displays an array of tasks and allows the user to modify it. Tasks are shown both as a list and as a table.
 * @param tasks An array of tasks to initialize the component with
 * @param onTasksChange a function that gets called when the task list is changed by the user.
 */
const TaskList = ({
  tasks: defaultTasks,
  onTasksChange
}: ITaskListProps) => {

  const [tasks, setTasks] = useState<ITask[]>(defaultTasks ? defaultTasks : []);

  useEffect(() => {
    onTasksChange(tasks);
  }, [tasks]);

  // since most calculations are based on the year and quarter, an IYearQuarter instead of a Date is used.
  
  const [yearQuarter, setYearQuarter] = useState<IYearQuarter>(getYearQuarterFromDate(new Date()));

  const onClickLastQuarter = () => {
    setYearQuarter(getLastYearQuarter(yearQuarter));
  }

  const onClickNextQuarter = () => {
    setYearQuarter(getNextYearQuarter(yearQuarter));
  }

  /*
   * The layout is first buttons and titles in one row at the top, then the list and table side by side.
   * Although they're side by side, generating them and ensuring that they're properly aligned is easier
   * when it's done row by row. Because of that, a TaskRow or TaskRowHeader generate components for both.
   */

  return (
    <>
      <Stack horizontal verticalAlign='center' horizontalAlign='space-around' className={styles.wideStack}>
        <DefaultButton onClick={onClickLastQuarter}>{strings.LastQuarter}</DefaultButton>
        <h1>{yearQuarter.year} Q{yearQuarter.quarter}</h1>
        <DefaultButton onClick={onClickNextQuarter}>{strings.NextQuarter}</DefaultButton>
      </Stack>

      <TaskRowHeader
        onAddTask={() => {
          setTasks([...tasks, {
            name: '',
            startDate: new Date(),
            endDate: new Date()
          }])
        }}
        addTaskDisabled={tasks.length >= MaxTasks}
        yearQuarter={yearQuarter}
        flex={flex}
      />

      {tasks.map((task, i) => {
        const onTaskUpdate = (task: ITask) => {
          const newTasks = tasks.slice();
          newTasks[i] = task;
          setTasks(newTasks);
        }

        const onTaskDelete = () => {
          const newTasks = tasks.slice();
          newTasks.splice(i, 1);
          setTasks(newTasks);
        }

        return (
          <TaskRow
            task={task}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
            yearQuarter={yearQuarter}
            flex={flex}
          />
        )
      })}

    </>
  )
}

export default TaskList;
