import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { SchedulerStatus, SchedulerJob, EmptyStatus } from '@features/scheduler/services/scheduler.models';

@Injectable()
export class SchedulerStore {
  private readonly schedulerStatus$ = new BehaviorSubject<SchedulerStatus>(EmptyStatus);
  private readonly selectedJob$ = new BehaviorSubject<SchedulerJob>(undefined);

  public schedulerStatus = this.schedulerStatus$.asObservable();
  public selectedJob = this.selectedJob$.asObservable();

  constructor(
    private client: SchedulerApiClient,
    private loadingWrapper: LoadingWrapperService
  ) { }

  loadData = () => {
    const call$ = this.loadingWrapper.wrap(this.client.loadData());
    call$.subscribe(data => {
      this.schedulerStatus$.next(data);
      this.selectedJob$.next(undefined);
    });
  }

  selectJob(name: string) {
    const job = this.schedulerStatus$
      .value
      .jobs
      .find(j => j.name === name);
    this.selectedJob$.next(this.clone(job));
  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));
}

