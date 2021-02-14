// prettier-ignore
export interface SchedulerStatus {
  schedulerState: SchedulerStateEnum;
  serverTime:     Date;
  jobs:           SchedulerJob[];
  isEmpty?:       boolean;
}

// prettier-ignore
export enum SchedulerStateEnum {
  Started = 'Active',
  Stopped = 'StandBy',
}

// prettier-ignore
export interface SchedulerJob {
  name:                      string;
  cronExpression:            string;
  cronExpressionDescription: string;
  active:                    boolean;
  fireIfMissed:              boolean;
  jobType:                   string;
  executionParameters?:      JobParameters;
  lastExecutionAt?:          Date;
  nextExecutionAt?:          Date;
  lastExecutionFailed:       boolean;
  lastExecutionMessage:      string;
  isNew?:                    boolean;
}

// prettier-ignore
export interface JobParameters {
  [key: string]: string;
}

// prettier-ignore
export const EmptyStatus: SchedulerStatus = {
  schedulerState: SchedulerStateEnum.Stopped,
  serverTime:     new Date(0),
  jobs:           [],
  isEmpty:        true,
};

// prettier-ignore
export interface JobExecutionHistory {
  failed:          boolean;
  executedAt:      Date;
  scheduledAt:     Date;
  onDemand:        boolean;
  message:         string;
  jobInstance:     any;
  exceptionThrown: any;
}
