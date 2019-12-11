import { Injectable } from '@angular/core';
import { Observable, of, pipe, Scheduler } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
  private apiUrl = '/api/scheduling/';
  constructor(private http: HttpClient) { }

  getSchedulerStatus(): Observable<SchedulerStatus> {
    return this.http
      .get(this.apiUrl)
      .pipe(
        cubesExtractResult(),
        map(s => {
          return {
            schedulerState: s.schedulerState,
            serverTime    : s.serverTime,
            jobs          : s.jobs.map((job, index) => {
              return {
                id                 : index.toString(),
                description        : job.name,
                cronExpression     : job.cronExpression,
                isActive           : job.active,
                fireIfMissed       : false,
                jobType            : job.jobType,
                executionParameters: job.executionParameters,
                lastExecutionAt    : job.lastExecutionAt,
                nextExecutionAt    : job.nextExecutionAt
              } as SchedulerJob;
            })
          } as SchedulerStatus;
        })
      );
  }

  saveSchedulerJob(job: SchedulerJob): Observable<string> {
    // Convert to Cubes persistance model
    const jobToPost = {
      id                : job.id,
      description       : job.description,
      cronSchedule      : job.cronExpression,
      jobTypeName       : job.jobType,
      isActive          : job.isActive,
      fireIfMissed      : job.fireIfMissed,
      executionParameter: job.executionParameters
    };
    return this.http
      .post(this.apiUrl + 'save', jobToPost)
      .pipe(cubesExtractMessage());
  }

  deleteSchedulerJob(jobID: string): Observable<string> {
    return this.http
      .delete(this.apiUrl + 'delete/' + jobID, {})
      .pipe(cubesExtractMessage());
  }

  schedulerCommand(command: string): Observable<any> {
    return this.http
      .post(this.apiUrl + '/command/' + command, {})
      .pipe(cubesExtractMessage());
  }

  runSchedulerJob(id: string): Observable<any> {
    return this.http
      .post(this.apiUrl + '/run/' + id, {})
      .pipe(cubesExtractMessage());
  }
}


// Extract message or messages from Cubes API result
const cubesExtractMessage = () =>
  map(res => {
    const tmp = (<any>res);
    if (tmp && tmp.hasOwnProperty('version') && (tmp.hasOwnProperty('message') || tmp.hasOwnProperty('messages'))) {
      const message = tmp.messages ?
        tmp.messages.join('\n') :
        tmp.message;
      return message;
    } else {
      return res;
    }
  });

// Extract result object from Cubes API result
const cubesExtractResult = () =>
  map(res => {
    const tmp = (<any>res);
    if (tmp && tmp.hasOwnProperty('result')) {
      return (<any>res).result;
    } else {
      return res;
    }
  });
