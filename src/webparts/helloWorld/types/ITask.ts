/**
 * Represents a task.
 * name is the name given to the task.
 * startDate is the time at which the task starts.
 * endDate is the time at which the task ends.
 * Only the year, month and day are important, smaller units aren't considered.
 */
export default interface ITask {
    name: string;
    startDate: Date;
    endDate: Date;
  }