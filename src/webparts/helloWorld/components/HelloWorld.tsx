import * as React from 'react';
import { useState } from 'react';
import styles from './HelloWorld.module.scss';
import { CommandBar, Stack } from 'office-ui-fabric-react';
import ITask from '../types/ITask';
import TasksForm from './TasksForm';
import TasksTable from './TasksTable';
import * as strings from 'HelloWorldWebPartStrings';

export interface IHelloWorldProps {

}

const HelloWorld = ({

}: IHelloWorldProps) => {

  enum ActiveWindow { Table, Form };

  const [activeWindow, setActiveWindow] = useState<ActiveWindow>(ActiveWindow.Table);

  const defaultTasks = [
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
    },
    {
      name: 'megamind',
      startDate: new Date(2023, 3, 15),
      endDate: new Date(2023, 9, 7)
    }
  ];

  const [tasks, setTasks] = useState<ITask[]>(defaultTasks);

  return (
    <>
      <CommandBar items={[
        {
          key: 'table',
          text: strings.MenubarTable,
          onClick: () => { setActiveWindow(ActiveWindow.Table); }
        },
        {
          key: 'form',
          text: strings.MenubarForm,
          onClick: () => { setActiveWindow(ActiveWindow.Form); }
        }
      ]} />

      <Stack horizontalAlign='center' className={styles.wideStack}>
        {activeWindow === ActiveWindow.Table && <TasksTable tasks={tasks} />}

        {activeWindow === ActiveWindow.Form &&
          <TasksForm
            defaultTasks={tasks}
            onTasksChange={(tasks) => { setTasks(tasks); }}
          />}
      </Stack>
    </>
  );
}

export default HelloWorld;