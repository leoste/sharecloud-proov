import * as strings from "HelloWorldWebPartStrings";
import { DefaultButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { MaxTasks } from "../helpers/constants";
import { getLastQuarter, getNextQuarter } from "../helpers/dateMath";
import styles from "../styles/Stack.module.scss";
import ITask from "../types/ITask";
import ITaskListFlex from "../types/ITaskListProportions";
import TaskRow from "./TaskRow";
import TaskRowHeader from "./TaskRowHeader";

export interface ITaskListProps {
  tasks?: ITask[],
  onTasksChange?: (tasks: ITask[]) => void
}

const TaskList = ({
  tasks: defaultTasks,
  onTasksChange
}: ITaskListProps) => {

  const [tasks, setTasks] = useState<ITask[]>(defaultTasks ? defaultTasks : []);

  useEffect(() => {
    onTasksChange(tasks);
  }, [tasks]);

  const now = new Date();

  const [year, setYear] = useState<number>(now.getFullYear());
  const [quarter, setQuarter] = useState<number>(Math.floor((now.getMonth() + 3) / 3));

  const flex: ITaskListFlex = {
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

  if (false) {
    setYear(1);
    setQuarter(1);
  }

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

  return (
    <>
      <Stack horizontal verticalAlign='center' horizontalAlign='space-around' className={styles.wideStack}>
        <DefaultButton onClick={onClickLastQuarter}>{strings.LastQuarter}</DefaultButton>
        <h1>{year} Q{quarter}</h1>
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
        year={year}
        quarter={quarter}
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
            year={year}
            quarter={quarter}
            flex={flex}
          />
        )
      })}

    </>
  )
}

export default TaskList;
