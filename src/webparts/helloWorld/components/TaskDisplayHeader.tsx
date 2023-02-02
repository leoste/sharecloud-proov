import { Stack } from "office-ui-fabric-react";
import * as React from "react";
import { getMonthWeekCount, getQuarterMonths, getQuarterWeeks } from "../helpers/dateMath";
import ITaskListFlex from "../types/ITaskListFlexProportions";
import CustomText from "./CustomText";
import styles from "../styles/List.module.scss";
import IYearQuarter from "../types/IQuarter";

export interface ITaskDisplayHeaderProps {
  yearQuarter: IYearQuarter,
  flex: ITaskListFlex
}

/**
 * A header row for a TaskDisplay.
 * It must be externally aligned.
 */
const TaskDisplayHeader = ({
  yearQuarter
}: ITaskDisplayHeaderProps) => {

  // generates two rows, first is a row of months and second is a row of weeks.
  // the weeks line have to line up with the months, so it's clear which month which week belongs to.

  return (
    <Stack>
      <Stack horizontal>
        {getQuarterMonths(yearQuarter.quarter).map(month => {
          return (
            <Stack.Item
              styles={{ root: { flex: getMonthWeekCount(yearQuarter.year, month) } }}
              className={styles.inactive}
            >
              <CustomText>
                {new Date(yearQuarter.year, month).toLocaleString('default', { month: 'long' })}
              </CustomText>
            </Stack.Item>
          );
        })}
      </Stack>

      <Stack horizontal>
        {getQuarterWeeks(yearQuarter).map(week => {
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
