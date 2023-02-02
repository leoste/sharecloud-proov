import { IconButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import TaskDisplayHeader, { ITaskDisplayHeaderProps } from "./TaskDisplayHeader";
import TaskFormHeader from "./TaskFormHeader";
import ITaskListFlex from "../types/ITaskListFlexProportions";

export interface ITaskRowHeaderProps extends ITaskDisplayHeaderProps {
  onAddTask: () => void,
  addTaskDisabled: boolean,
  flex: ITaskListFlex
}

/**
 * A header row for a list of TaskRows.
 */
const TaskRowHeader = ({
  onAddTask,
  addTaskDisabled,
  flex,
  yearQuarter,
}: ITaskRowHeaderProps) => {

  return (
    <Stack horizontal verticalAlign="center" >
        <Stack.Item styles={{ root: { flex: flex.leftFlex } }}>
          <IconButton
            iconProps={{ iconName: 'Add' }}
            onClick={onAddTask}
            disabled={addTaskDisabled}
          />
        </Stack.Item>

        <Stack.Item styles={{ root: { flex: flex.middleFlex, marginRight: flex.middleMargin } }}>
          <TaskFormHeader flex={flex}/>
        </Stack.Item>

        <Stack.Item styles={{ root: { flex: flex.rightFlex } }}>
          <TaskDisplayHeader
            yearQuarter={yearQuarter}
            flex={flex}
          />
        </Stack.Item>
      </Stack>
  )
}

export default TaskRowHeader;
