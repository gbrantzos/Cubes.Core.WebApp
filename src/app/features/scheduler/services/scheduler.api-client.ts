import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import {
  JobParameters,
  SchedulerJob,
  SchedulerStateEnum,
  SchedulerStatus,
} from '@features/scheduler/services/scheduler.models';
import cronstrue from 'cronstrue';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { safeDump } from 'js-yaml';

@Injectable()
export class SchedulerApiClient {
  private baseUrl: string;
  private uiUrl: string;

  constructor(private http: HttpClient, config: ConfigurationService) {
    this.baseUrl = `${config.apiUrl}/scheduling`;
    this.uiUrl = config.uiUrl;
  }

  public loadData(): Observable<SchedulerStatus> {
    return this.http
      .get<CubesSchedulerStatus>(this.baseUrl)
      .pipe(map((response) => this.processCubesResponse(response)));
  }

  public saveData(status: SchedulerStatus): Observable<SchedulerStatus> {
    const data = status.jobs.map((j) => {
      const job: CubesSchedulerJob = {
        name:           j.name,
        active:         j.active,
        refireIfMissed: j.fireIfMissed,
        cronExpression: j.cronExpression,
        jobType:        j.jobType,
        parameters:     j.executionParameters,
      };
      return job;
    });

    const url = `${this.baseUrl}/save`;
    return this.http.post<CubesSchedulerStatus>(url, data).pipe(map((response) => this.processCubesResponse(response)));
  }

  public schedulerCommand(command: string): Observable<SchedulerStatus> {
    return this.http
      .post<CubesSchedulerStatus>(this.baseUrl + '/command/' + command, {})
      .pipe(map((response) => this.processCubesResponse(response)));
  }

  public runSchedulerJob(jobName: string): Observable<string> {
    return this.http.post(this.baseUrl + '/execute/' + jobName, {}, {
      observe: 'body',
      responseType: 'text',
    });
  }

  public getSample(provider: string): Observable<string> {
    return this.http.get(`${this.uiUrl}/requestSample/${provider}`).pipe(
      map((sample) => {
        return safeDump(sample);
      })
    );
  }
  private processCubesResponse(response: CubesSchedulerStatus): SchedulerStatus {
    const data: SchedulerStatus = {
      schedulerState: response.schedulerState === 'Active' ? SchedulerStateEnum.Started : SchedulerStateEnum.Stopped,
      serverTime: new Date(response.serverTime),
      jobs: response.jobs.map((j) => {
        const job: SchedulerJob = {
          name:                      j.name,
          cronExpression:            j.cronExpression,
          cronExpressionDescription: cronstrue.toString(j.cronExpression, { use24HourTimeFormat: true }),
          jobType:                   j.jobType,
          active:                    j.active,
          fireIfMissed:              j.refireIfMissed,
          executionParameters:       j.jobParameters,
          nextExecutionAt:           j.nextFireTime ? new Date(j.nextFireTime) : undefined,
          lastExecutionAt:           j.previousFireTime ? new Date(j.previousFireTime) : undefined,
          lastExecutionFailed:       j.lastExecutionFailed,
          lastExecutionMessage:      j.lastExecutionMessage,
        };
        return job;
      }),
    };

    return data;
  }
}

interface CubesSchedulerStatus {
  schedulerState: string;
  serverTime:     string;
  jobs:           [
    {
      name:                 string;
      active:               boolean;
      refireIfMissed:       boolean;
      cronExpression:       string;
      jobType:              string;
      previousFireTime:     string;
      nextFireTime:         string;
      lastExecutionFailed:  boolean;
      lastExecutionMessage: string;
      jobParameters:        {
        [name: string]: string;
      };
    }
  ];
}

interface CubesSchedulerJob {
  name:           string;
  active:         boolean;
  refireIfMissed: boolean;
  cronExpression: string;
  jobType:        string;
  parameters:     JobParameters;
}
