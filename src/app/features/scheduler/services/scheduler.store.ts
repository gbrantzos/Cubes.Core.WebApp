import { Injectable } from '@angular/core';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { EmptyStatus, SchedulerJob, SchedulerStatus } from '@features/scheduler/services/scheduler.models';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import cronstrue from 'cronstrue';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SchedulerStore {
  private readonly schedulerStatus$ = new BehaviorSubject<SchedulerStatus>(EmptyStatus);
  private readonly selectedJob$ = new BehaviorSubject<SchedulerJob>(undefined);

  public schedulerStatus = this.schedulerStatus$.asObservable();
  public selectedJob = this.selectedJob$.asObservable();
  public get snapshot() {
    return this.schedulerStatus$.value;
  }

  constructor(
    private client: SchedulerApiClient,
    private loadingWrapper: LoadingWrapperService,
    private dialog: DialogService
  ) {}

  loadData = () => {
    const call$ = this.loadingWrapper.wrap(this.client.loadData());
    call$.subscribe((data) => {
      this.schedulerStatus$.next(data);
      this.selectedJob$.next(undefined);
    });
  }

  saveData = () => {
    const call$ = this.loadingWrapper.wrap(this.client.saveData(this.schedulerStatus$.value));
    call$.subscribe((data: string) => {
      this.dialog.snackSuccess(data);
    });
  }

  sendCommand(command: string): Observable<string> {
    const message = command === 'start' ? 'started' : 'stopped';
    const call$ = this.client.schedulerCommand(command).pipe(
      map((data) => {
        this.schedulerStatus$.next(data);
        this.selectedJob$.next(undefined);
        return `Scheduler was ${message}.`;
      })
    );
    return this.loadingWrapper.wrap(call$);
  }

  selectJob(name: string) {
    const job = this.schedulerStatus$.value.jobs.find((j) => j.name === name);
    this.selectedJob$.next(this.clone(job));
  }

  addNewJob() {
    const job: SchedulerJob = {
      name: this.uniqueName(),
      cronExpression: '0 0 0 ? * *',
      cronExpressionDescription: cronstrue.toString('0 0 0 ? * *', { use24HourTimeFormat: true }),
      active: false,
      fireIfMissed: false,
      jobType: '',
      executionParameters: null,
      isNew: true,
    };
    this.selectedJob$.next(job);
  }

  discardNewJob() {
    this.selectedJob$.next(undefined);
  }

  deleteJob(originalName: string) {
    const temp = this.schedulerStatus$.value.jobs
      .filter((cnx) => cnx.name !== originalName)
      .sort((a, b) => a.name.localeCompare(b.name));

    const newStatus = {
      ...this.schedulerStatus$.value,
      jobs: temp,
    };
    this.schedulerStatus$.next(newStatus);
    this.selectedJob$.next(undefined);
    this.saveData();
  }

  saveJob(originalName: string, job: SchedulerJob) {
    if (!job.cronExpressionDescription) {
      job.cronExpressionDescription = cronstrue.toString(job.cronExpression, { use24HourTimeFormat: true });
    }

    const temp = this.schedulerStatus$.value.jobs.filter((s) => s.name !== originalName);
    const newStatus = {
      ...this.schedulerStatus$.value,
      jobs: [...temp, job].sort((a, b) => a.name.localeCompare(b.name)),
    };
    this.schedulerStatus$.next(newStatus);
    this.saveData();

    const jobClone = this.clone(job);
    jobClone.isNew = false;
    jobClone.cronExpressionDescription = cronstrue.toString(job.cronExpression, { use24HourTimeFormat: true });
    this.selectedJob$.next(jobClone);
  }

  private uniqueName() {
    let name = '';
    let id = this.schedulerStatus$.value.jobs.length;
    do {
      id++;
      name = `Job.#${id}`;
    } while (this.schedulerStatus$.value.jobs.findIndex((p) => p.name === name) !== -1);

    return name;
  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));
}
