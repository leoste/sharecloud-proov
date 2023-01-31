import { Stack } from "office-ui-fabric-react";
import * as React from "react";
import { getMonthWeekCount, getQuarterMonths, getQuarterWeeks } from "../helpers/dateMath";
import ITaskListFlex from "../types/ITaskListProportions";
import CustomText from "./CustomText";
import styles from "../styles/List.module.scss";

export interface ITaskDisplayHeaderProps {
  year: number,
  quarter: number,
  flex: ITaskListFlex
}

const TaskDisplayHeader = ({
  year,
  quarter
}: ITaskDisplayHeaderProps) => {

  return (
    <Stack>
      <Stack horizontal>
        {getQuarterMonths(quarter).map(month => {
          return (
            <Stack.Item
              styles={{ root: { flex: getMonthWeekCount(year, month) } }}
              className={styles.inactive}
            >
              <CustomText>
                {new Date(year, month).toLocaleString('default', { month: 'long' })}
              </CustomText>
            </Stack.Item>
          );
        })}
      </Stack>

      <Stack horizontal>
        {getQuarterWeeks(year, quarter).map(week => {
          return (
            <Stack.Item
              styles={{ root: { flex: 1 } }}
              className={styles.inactive}
            >
              <CustomText>
                {week}
              </CustomText>
            </Stack.Item>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default TaskDisplayHeader;
