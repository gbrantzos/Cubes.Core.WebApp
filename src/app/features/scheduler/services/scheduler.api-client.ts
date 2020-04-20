import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SchedulerStatus,
  SchedulerStateEnum,
  SchedulerJob,
  JobParameters
} from '@features/scheduler/services/scheduler.models';
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
        map(response => this.processCubesResponse(response)));
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

  public schedulerCommand(command: string): Observable<SchedulerStatus> {
    return this.http
      .post<CubesSchedulerStatus>(this.baseUrl + '/command/' + command, {})
      .pipe(
        map(response => this.processCubesResponse(response))
      );
  }

  public runSchedulerJob(jobName: string): Observable<any> {
    return this.http
      .post(this.baseUrl + '/execute/' + jobName, {})
      .pipe(
        map(res => {
          return typeof (res) === 'string' ? res : 'Job execution triggered!';
        })
      );
  }

  private processCubesResponse(response: CubesSchedulerStatus): SchedulerStatus {
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
  }
}

interface CubesSchedulerStatus {
  schedulerState: string;
  serverTime: string;
  jobs: [{
    name: string;
    active: boolean,
    cronExpression: string;
    jobType: string;
    previousFireTime: string;
    nextFireTime: string;
    lastExecutionFailed: boolean;
    jobParameters: {
      [name: string]: string;
    }
  }];
}

interface CubesSchedulerJob {
  name: string;
  active: boolean;
  cronExpression: string;
  jobType: string;
  parameters: JobParameters;
}
