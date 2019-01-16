import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@src/environments/environment';

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
  private apiUrl = environment.cubesApiUrl + '/scheduler/';
  constructor(private http: HttpClient) { }

  getSchedulerStatus(): Observable<SchedulerStatus> {
    return this.http
      .get(this.apiUrl + 'status')
      .pipe(
        map(res => (<any>res).result)
      );
  }

  saveSchedulerJob(job: SchedulerJob): Observable<any> {
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
      .post(this.apiUrl + 'save', jobToPost);
  }

  schedulerCommand(command: string): Observable<any> {
    return this.http
      .post(this.apiUrl + '/' + command, {});
  }
}
