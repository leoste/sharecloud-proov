import { IconButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import ITask from "../types/ITask";
import TaskDisplay, { ITaskDisplayProps } from "./TaskDisplay";
import TaskForm, { ITaskFormProps } from "./TaskForm";
import ITaskListFlex from "../types/ITaskListFlexProportions";

export interface ITaskRowProps extends ITaskDisplayProps, ITaskFormProps {
  task: ITask,
  onTaskDelete: () => void,
  flex: ITaskListFlex
}

/**
 * Generates one row based on given task. It includes a delete button at the left,
 * a TaskForm for the task properties and a TaskDisplay for a visual table row.
 * The task will be visible in the table row, if it matches up with the given yearQuarter.
 */
const TaskRow = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  yearQuarter,
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
          yearQuarter={yearQuarter}
          flex={flex}
        />
      </Stack.Item>
    </Stack>
  )
}

export default TaskRow;
