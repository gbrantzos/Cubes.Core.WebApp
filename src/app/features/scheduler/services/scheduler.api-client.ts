import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SchedulerStatus, SchedulerStateEnum, SchedulerJob, CubesSchedulerJob } from '@features/scheduler/services/scheduler.models';
import { ConfigurationService } from '@core/services/configuration.service';
import cronstrue from 'cronstrue';


@Injectable()
export class SchedulerApiClient {
  private baseUrl: string;
  constructor(
    private http: HttpClient,
    config: ConfigurationService
  ) { this.baseUrl = `${config.apiUrl}/scheduling`; }

  public loadData(): Observable<SchedulerStatus> {
    return this.http
      .get<CubesSchedulerStatus>(this.baseUrl)
      .pipe(
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
                cronExpressionDescription: cronstrue.toString(j.cronExpression, { use24HourTimeFormat: true }),
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

  public saveData(status: SchedulerStatus) {
    const data = status
      .jobs
      .map(j => {
        const job: CubesSchedulerJob = {
          name: j.name,
          active: j.active,
          cronExpression: j.cronExpression,
          jobType: j.jobType,
          parameters: j.executionParameters
        };
        return job;
      });

    const url = `${this.baseUrl}/save`;
    return this.http
      .post(url, data);
  }
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
    'nextFireTime': null,
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
    'active': true,
    'cronExpression': '0/45 * * * * ?',
    'cronExpressionDescription': 'every 45 seconds',
    'jobType': 'Cubes.Core.Scheduling.Jobs.SampleJob',
    'previousFireTime': null,
    'nextFireTime': '2020-04-20T22:03:11.4748635+03:00',
    'lastExecutionFailed': false,
    'jobParameters': {}
  }
  ]
};
