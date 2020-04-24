export interface SchedulerStatus {
  schedulerState: SchedulerStateEnum;
  serverTime: Date;
  jobs: SchedulerJob[];
  isEmpty?: boolean;
}

export enum SchedulerStateEnum {
  Started = 'Active',
  Stopped = 'StandBy'
}

export interface SchedulerJob {
  name: string;
  cronExpression: string;
  cronExpressionDescription: string;
  active: boolean;
  fireIfMissed: boolean;
  jobType: string;
  executionParameters?: JobParameters;
  lastExecutionAt?: Date;
  nextExecutionAt?: Date;
  lastExecutionFailed: boolean;
  lastExecutionMessage: string;
  isNew?: boolean;
}

export interface JobParameters {
  [key: string]: string;
}

export const EmptyStatus: SchedulerStatus = {
  schedulerState: SchedulerStateEnum.Stopped,
  serverTime: new Date(0),
  jobs: [],
  isEmpty: true
};
