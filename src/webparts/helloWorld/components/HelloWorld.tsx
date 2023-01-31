import * as React from 'react';
import { useState } from 'react';
import ITask from '../types/ITask';
import TaskList from './TaskList';

export interface IHelloWorldProps {

}

const HelloWorld = ({

}: IHelloWorldProps) => {

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
      <TaskList
        tasks={tasks}
        onTasksChange={(tasks) => { setTasks(tasks); }}
      />
    </>
  );
}

export default HelloWorld;