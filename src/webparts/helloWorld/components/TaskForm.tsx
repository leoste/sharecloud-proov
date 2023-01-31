import { DatePicker, Stack, TextField } from "office-ui-fabric-react";
import * as React from "react";
import ITask from "../types/ITask";
import ITaskListFlex from "../types/ITaskListProportions";

export interface ITaskFormProps {
  task: ITask,
  onTaskUpdate: (task: ITask) => void,
  flex: ITaskListFlex
}

const TaskForm = ({
  task: superTask,
  onTaskUpdate,
  flex
}: ITaskFormProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('default', { month: '2-digit', day: '2-digit' });
  }

  return (
    <Stack horizontal>
      <Stack.Item styles={{ root: { flex: flex.middle.nameFlex } }}>
        <TextField
          value={superTask.name}
          onChange={(target, value) => { onTaskUpdate({ ...superTask, name: value }); }}
        />
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middle.startDateFlex } }}>
        <DatePicker
          value={superTask.startDate}
          onSelectDate={(date) => { onTaskUpdate({ ...superTask, startDate: date }); }}

          formatDate={formatDate}
        />
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middle.endDateFlex } }}>
        <DatePicker
          value={superTask.endDate}
          onSelectDate={(date) => { onTaskUpdate({ ...superTask, endDate: date }); }}

          formatDate={formatDate}
        />
      </Stack.Item>
    </Stack>
  )
}

export default TaskForm;
