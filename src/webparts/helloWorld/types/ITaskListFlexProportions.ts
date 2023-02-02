/**
 * Used to determine the proportions of the TaskList component and its sub-components.
 */
export default interface ITaskListFlex {
  leftFlex: number,
  middleFlex: number,
  middle: {
    nameFlex: number,
    startDateFlex: number,
    endDateFlex: number
  },
  rightFlex: number,
  middleMargin: number
}