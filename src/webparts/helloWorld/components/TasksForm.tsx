import { DatePicker, IconButton, Stack, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { FirstDayOfWeek, FirstWeekOfYear, maxTasks } from "../helpers/constants";
import ITask from "../types/ITask";
import styles from "./HelloWorld.module.scss";

export interface ITasksFormProps {
  defaultTasks?: ITask[],
  onTasksChange: (tasks: ITask[]) => void
}

const TasksForm = ({
  defaultTasks,
  onTasksChange
}: ITasksFormProps) => {
  const [tasks, setTasks] = useState<ITask[]>(defaultTasks ? defaultTasks : []);

  useEffect(() => {
    onTasksChange(tasks);
  }, [tasks]);

  return (
    <Stack horizontalAlign='center' className={styles.wideStack}>
      <IconButton
        iconProps={{ iconName: 'Add' }}
        onClick={() => {
          setTasks([...tasks, {
            name: '',
            startDate: new Date(),
            endDate: new Date()
          }])
        }}
        disabled={tasks.length >= maxTasks}
      />

      {tasks.map((task, i) => {
        return (
          <Stack horizontal horizontalAlign='space-between' verticalAlign='end' className={styles.wideStack}>
            <Stack horizontal horizontalAlign='start'>
              <TextField
                label='Name'
                value={task.name}
                onChange={(target, value) => {
                  const newTasks = tasks.slice();
                  newTasks[i].name = value;
                  setTasks(newTasks);
                }}
              />
              <DatePicker
                label='Start date'
                value={task.startDate}
                showWeekNumbers
                onSelectDate={(value) => {
                  const newTasks = tasks.slice();
                  newTasks[i].startDate = value;
                  setTasks(newTasks);
                }}
                firstWeekOfYear={FirstWeekOfYear}
                firstDayOfWeek={FirstDayOfWeek}
              />
              <DatePicker
                label='End date'
                value={task.endDate}
                showWeekNumbers
                onSelectDate={(value) => {
                  const newTasks = tasks.slice();
                  newTasks[i].endDate = value;
                  setTasks(newTasks);
                }}
                firstWeekOfYear={FirstWeekOfYear}
                firstDayOfWeek={FirstDayOfWeek}
              />
            </Stack>

            <IconButton
              iconProps={{ iconName: 'Delete' }}
              onClick={() => {
                const newTasks = tasks.slice();
                newTasks.splice(i, 1);
                setTasks(newTasks);
              }}
            />
          </Stack>
        );
      })}
    </Stack>);
}

export default TasksForm;