import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SchedulerStatus {
  state: SchedulerStateEnum;
  serverTime: Date;
  jobs: SchedulerJob[];
}

export enum SchedulerStateEnum {
  Started = 'Started',
  Stopped = 'Stopped'
}

export interface SchedulerJob {
  id: string;
  description: string;
  cronExpression: string;
  isActive: boolean;
  fireIfMissed: boolean;
  jobType: string;
  executionParameters: string;
  lastExecutionAt?: Date;
  lastExecutionResult?: string;
  nextExecutionAt?: Date;
}

export function isSchedulerJob(job: any): job is SchedulerJob {
  return job && <SchedulerJob>job.id !== undefined;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor() { }

  getSchedulerStatus(): Observable<SchedulerStatus> {
    const details: SchedulerStatus = {
      state: SchedulerStateEnum.Stopped,
      serverTime: new Date(),
      jobs: [
        {
          id: '1348c916-0f37-4bbe-8092-69fd1429c9b9',
          description: 'A scheduler job',
          cronExpression: '* 3 * * * *',
          isActive: true,
          fireIfMissed: false,
          jobType: 'Cubes.Core.Jobs.ExecuteCommand',
          executionParameters: null
        },
        {
          id: 'empty',
          description: 'Another job...',
          cronExpression: '* 3 * * * *',
          isActive: false,
          fireIfMissed: false,
          jobType: 'Cubes.Core.Jobs.ExecuteCommand',
          executionParameters: null
        },
        {
          id: 'empty',
          description: 'A scheduler job',
          cronExpression: '* 3 * * * *',
          isActive: true,
          fireIfMissed: false,
          lastExecutionAt: new Date(2018, 12, 26, 23, 45, 23),
          lastExecutionResult: 'OK...',
          jobType: 'Cubes.Core.Jobs.ExecuteCommand',
          executionParameters: null
        },
        {
          id: 'empty',
          description: 'Another job...',
          cronExpression: '* 3 * * * *',
          isActive: false,
          fireIfMissed: false,
          nextExecutionAt: new Date(2019, 1, 1, 3, 45, 0),
          jobType: 'Cubes.Core.Jobs.ExecuteCommand',
          executionParameters: null
        }

      ]
    };


    const empty: SchedulerStatus = {
      state: SchedulerStateEnum.Stopped,
      serverTime: new Date(),
      jobs: []
    };
    return of(details);
  }
}
