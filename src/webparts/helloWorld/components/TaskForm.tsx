import { DatePicker, Stack, TextField } from "office-ui-fabric-react";
import * as React from "react";
import ITask from "../types/ITask";
import ITaskListFlex from "../types/ITaskListFlexProportions";

export interface ITaskFormProps {
  task: ITask,
  onTaskUpdate: (task: ITask) => void,
  flex: ITaskListFlex
}

/**
 * Generates a form for the task. The user can set the name, start and end dates.
 * It must be externally aligned.
 * @param onTaskUpdate is called whenever the user changes his input.
 */
const TaskForm = ({
  task,
  onTaskUpdate,
  flex
}: ITaskFormProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('default', { month: '2-digit', day: '2-digit' });
  }

  // The given task is used to prefill form data.
  // When the user changes any field, a new task object with the new data is emitted to the parent component.

  return (
    <Stack horizontal>
      <Stack.Item styles={{ root: { flex: flex.middle.nameFlex } }}>
        <TextField
          value={task.name}
          onChange={(target, value) => { onTaskUpdate({ ...task, name: value }); }}
        />
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middle.startDateFlex } }}>
        <DatePicker
          value={task.startDate}
          onSelectDate={(date) => { onTaskUpdate({ ...task, startDate: date }); }}

          formatDate={formatDate}
        />
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middle.endDateFlex } }}>
        <DatePicker
          value={task.endDate}
          onSelectDate={(date) => { onTaskUpdate({ ...task, endDate: date }); }}

          formatDate={formatDate}
        />
      </Stack.Item>
    </Stack>
  )
}

export default TaskForm;
