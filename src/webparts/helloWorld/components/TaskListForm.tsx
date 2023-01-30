import { IconButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import ITask from '../types/ITask';
import TaskListItem from './TaskListItem';

export interface ITaskFormProps {
    onUpdateTaskList: (taskList: ITask[]) => void
}

const TaskListForm = ({
    onUpdateTaskList
}: ITaskFormProps) => {

    const [taskList, setTaskList] = useState<ITask[]>([]);

    const onUpdateTask = (task: ITask) => {

    }

    return (
        <>
            <Stack>
                {taskList.map((task) => {
                    return (
                        <Stack horizontal>
                            <IconButton
                                iconProps={{ iconName: 'Delete' }}
                                onClick={() => {
                                    setTaskList(taskList.filter(t => t.id !== task.id));
                                }}
                            />
                            <TaskListItem key={task.id} onUpdateTask={onUpdateTask} task={task}></TaskListItem>
                        </Stack>
                    );
                })}
                <IconButton 
                    iconProps={{ iconName: 'Add' }}
                    onClick={() => {
                        setTaskList([
                            ...taskList,
                            {
                                id: taskList.length > 0 ? taskList[taskList.length - 1].id + 1 : 1,
                                name: "",
                                startDate: new Date(),
                                endDate: new Date()
                            }
                        ]);
                    }}
                />
            </Stack>
        </>
    )
}

export default TaskListForm;