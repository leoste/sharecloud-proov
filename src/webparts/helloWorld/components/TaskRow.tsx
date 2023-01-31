import { IconButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import ITask from "../types/ITask";
import TaskDisplay, { ITaskDisplayProps } from "./TaskDisplay";
import TaskForm, { ITaskFormProps } from "./TaskForm";
import ITaskListFlex from "../types/ITaskListProportions";

export interface ITaskRowProps extends ITaskDisplayProps, ITaskFormProps {
  task: ITask,
  onTaskDelete: () => void,
  flex: ITaskListFlex
}

const TaskRow = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  year,
  quarter,
  flex
}: ITaskRowProps) => {

  return (
    <Stack horizontal verticalAlign="center" >
      <Stack.Item styles={{ root: { flex: flex.leftFlex } }}>
        <IconButton
          iconProps={{ iconName: 'Delete' }}
          onClick={onTaskDelete}
        />
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middleFlex, marginRight: flex.middleMargin } }}>
        <TaskForm
          task={task}
          onTaskUpdate={onTaskUpdate}
          flex={flex}
        />
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.rightFlex } }}>
        <TaskDisplay
          task={task}
          year={year}
          quarter={quarter}
          flex={flex}
        />
      </Stack.Item>
    </Stack>
  )
}

export default TaskRow;
