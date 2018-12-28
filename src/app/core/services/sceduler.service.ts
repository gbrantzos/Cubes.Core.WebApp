import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SchedulerStatus {
  status: string;
  serverTime: Date;
}

export interface SchedulerJob {
  id: string;
  description: string;
  cronExpression: string;
  isActive: boolean;
  fireIfMissed: boolean;
}

export interface SchedulerDetails {
  status: SchedulerStatus;
  jobs: SchedulerJob[];
}

@Injectable({
  providedIn: 'root'
})
export class ScedulerService {

  constructor() { }

  getScehdulerDetails(): Observable<SchedulerDetails> {
    const details: SchedulerDetails = {
      status: {
        status: 'stopped',
        serverTime: new Date()
      },
      jobs: [
        {
          id: 'empty',
          description: 'A scheduler job',
          cronExpression: '* 3 * * * *',
          isActive: true,
          fireIfMissed: false
        }
      ]
    };

    return of(details);
  }
}
