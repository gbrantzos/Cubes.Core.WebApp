import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SchedulerStatus, SchedulerStateEnum, SchedulerJob } from '@features/scheduler/services/scheduler.models';
import cronstrue from 'cronstrue';


@Injectable()
export class SchedulerApiClient {
  constructor(
    private http: HttpClient
  ) { }

  public loadData(): Observable<SchedulerStatus> {
    return of(cubesMockData)
      .pipe(
        delay(1200),
        map(response => {
          const data: SchedulerStatus = {
            schedulerState: response.schedulerState === 'Active'
              ? SchedulerStateEnum.Started
              : SchedulerStateEnum.Stopped,
            serverTime: new Date(response.serverTime),
            jobs: response.jobs.map(j => {
              const job: SchedulerJob = {
                name: j.name,
                cronExpression: j.cronExpression,
                cronExpressionDescription: cronstrue.toString(j.cronExpression),
                jobType: j.jobType,
                active: j.active,
                fireIfMissed: false,
                executionParameters: j.jobParameters,
                nextExecutionAt: j.nextFireTime ? new Date(j.nextFireTime) : undefined,
                lastExecutionAt: j.previousFireTime ? new Date(j.previousFireTime) : undefined,
                lastExecutionResult: j.lastExecutionFailed ? 'Failed' : ''
              };
              return job;
            })
          };

          return data;
        }));
  }

  public saveData() { }
}

interface CubesSchedulerStatus {
  schedulerState: string;
  serverTime: string;
  jobs: [{
    name: string;
    active: boolean,
    cronExpression: string;
    cronExpressionDescription: string;
    jobType: string;
    previousFireTime: string;
    nextFireTime: string;
    lastExecutionFailed: boolean;
    jobParameters: {
      [name: string]: string;
    }
  }];
}

const cubesMockData = {
  'schedulerState': 'Active',
  'serverTime': '2020-04-19T12:03:11.4748635+03:00',
  'jobs': [{
    'name': 'Dummy job',
    'active': false,
    'cronExpression': '0/50 * * ? * *',
    'cronExpressionDescription': 'every 50 seconds',
    'jobType': 'Cubes.Core.Scheduling.Jobs.ExecuteRequestJob',
    'previousFireTime': null,
    'nextFireTime': '2020-04-20T22:03:11.4748635+03:00',
    'lastExecutionFailed': true,
    'jobParameters': {
      'RequestInstance': 'Command: calc.exe',
      'RequestType': 'Cubes.Core.Commands.Basic.RunOsProcess'
    }
  }, {
    'name': 'New scheduler job',
    'active': false,
    'cronExpression': '* * * ? * 2-6/2',
    'cronExpressionDescription': 'at 08:00 PM',
    'jobType': 'Cubes.Core.Scheduling.Jobs.ExecuteRequestJob',
    'previousFireTime': null,
    'nextFireTime': null,
    'lastExecutionFailed': false,
    'jobParameters': {
      'RequestInstance': 'notepad.exe',
      'RequestType': 'Cubes.Core.Commands.Basic.RunOsProcess'
    }
  }, {
    'name': 'Sample Job',
    'active': false,
    'cronExpression': '0/45 * * * * ?',
    'cronExpressionDescription': 'every 45 seconds',
    'jobType': 'Cubes.Core.Scheduling.Jobs.SampleJob',
    'previousFireTime': null,
    'nextFireTime': null,
    'lastExecutionFailed': false,
    'jobParameters': {}
  }
  ]
};
