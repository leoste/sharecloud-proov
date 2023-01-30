import * as React from 'react';
import { useState, useEffect } from 'react';
import { DatePicker, Stack, TextField } from 'office-ui-fabric-react';
import { FirstDayOfWeek, FirstWeekOfYear } from '../helpers/constants';
import ITask from '../types/ITask';

export interface ITaskItemProps {
    onUpdateTask: (task: ITask) => void,
    task: ITask
}

const TaskListItem = ({
    onUpdateTask,
    task
}: ITaskItemProps) => {
    const id = task.id;

    const [name, setName] = useState<string>(task.name);
    const [startDate, setStartDate] = useState<Date>(task.startDate);
    const [endDate, setEndDate] = useState<Date>(task.endDate);

    useEffect(() => {
        const task: ITask = {
            id,
            name,
            startDate,
            endDate
        };

        onUpdateTask(task);
    }, [name])

    return (
        <Stack horizontal>
            <TextField
                label="Name"
                required
                value={name}
                onChange={(target, value) => { setName(value); }}
            />
            <DatePicker
                label={"Start date"}
                firstDayOfWeek={FirstDayOfWeek}
                firstWeekOfYear={FirstWeekOfYear}
                showWeekNumbers={true}
                showMonthPickerAsOverlay={true}
                isRequired
                value={startDate}
                onSelectDate={(value) => { setStartDate(value); }}
            />
            <DatePicker
                label={"End date"}
                firstDayOfWeek={FirstDayOfWeek}
                firstWeekOfYear={FirstWeekOfYear}
                showWeekNumbers={true}
                showMonthPickerAsOverlay={true}
                isRequired
                onSelectDate={(value) => { setEndDate(value); }}
            />
        </Stack>
    )
}

export default TaskListItem;