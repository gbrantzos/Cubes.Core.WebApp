export interface SchedulerStatus {
  schedulerState: SchedulerStateEnum;
  serverTime: Date;
  jobs: SchedulerJob[];
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
  lastExecutionResult?: string;
  nextExecutionAt?: Date;
  isNew?: boolean;
}

export interface JobParameters {
  [key: string]: string;
}

export const EmptyStatus: SchedulerStatus = {
  schedulerState: SchedulerStateEnum.Stopped,
  serverTime: new Date(),
  jobs: []
};

export interface CubesSchedulerJob {
  name: string;
  active: boolean;
  cronExpression: string;
  jobType: string;
  parameters: JobParameters;
}
