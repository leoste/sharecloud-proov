import * as strings from "HelloWorldWebPartStrings";
import { Stack, } from "office-ui-fabric-react";
import * as React from "react";
import ITaskListFlex from "../types/ITaskListFlexProportions";
import CustomText from "./CustomText";

export interface ITaskFormHeaderProps {
  flex: ITaskListFlex
}

/**
 * A header row for a TaskForm.
 * It must be externally aligned.
 */
const TaskFormHeader = ({
  flex
}: ITaskFormHeaderProps) => {

  return (
    <Stack horizontal>
      <Stack.Item styles={{ root: { flex: flex.middle.nameFlex } }}>
        <CustomText>{strings.FormName}</CustomText>
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middle.startDateFlex } }}>
        <CustomText>{strings.FormStartDate}</CustomText>
      </Stack.Item>

      <Stack.Item styles={{ root: { flex: flex.middle.endDateFlex } }}>
        <CustomText>{strings.FormEndDate}</CustomText>
      </Stack.Item>
    </Stack>
  )
}

export default TaskFormHeader;
