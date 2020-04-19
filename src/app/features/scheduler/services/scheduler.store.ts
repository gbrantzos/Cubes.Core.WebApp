import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { SchedulerStatus, SchedulerJob, EmptyStatus } from '@features/scheduler/services/scheduler.models';
import cronstrue from 'cronstrue';


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

  saveData = () => console.log('Save ...');

  selectJob(name: string) {
    const job = this.schedulerStatus$
      .value
      .jobs
      .find(j => j.name === name);
    this.selectedJob$.next(this.clone(job));
  }

  addNewJob() {
    const job: SchedulerJob = {
      name: this.uniqueName(),
      cronExpression: '0 0 0 ? * *',
      cronExpressionDescription: cronstrue.toString('0 0 0 ? * *'),
      active: false,
      fireIfMissed: false,
      jobType: '',
      executionParameters: null,
      isNew: true
    };
    this.selectedJob$.next(job);
  }

  discardNewJob() { this.selectedJob$.next(undefined); }

  deleteJob(originalName: string) {
    const temp = this.schedulerStatus$
      .value
      .jobs
      .filter(cnx => cnx.name !== originalName)
      .sort((a, b) => a.name.localeCompare(b.name));

    const newStatus = {
      ...this.schedulerStatus$.value,
      jobs: temp
    };
    this.schedulerStatus$.next(newStatus);
    this.selectedJob$.next(undefined);
    this.saveData();
  }

  saveJob(originalName: string, job: SchedulerJob) {
    if (!job.cronExpressionDescription) {
      job.cronExpressionDescription = cronstrue.toString(job.cronExpression);
    }
    console.log(job);
    const temp = this.schedulerStatus$
      .value
      .jobs
      .filter(s => s.name !== originalName);
    const newStatus = {
      ...this.schedulerStatus$.value,
      jobs: [...temp, job].sort((a, b) => a.name.localeCompare(b.name))
    };
    this.schedulerStatus$.next(newStatus);
    this.saveData();

    const jobClone = this.clone(job);
    jobClone.isNew = false;
    jobClone.cronExpressionDescription = cronstrue.toString(job.cronExpression);
    this.selectedJob$.next(jobClone);
  }

  private uniqueName() {
    let name = '';
    let id = this.schedulerStatus$.value.jobs.length;
    do {
      id++;
      name = `Job.#${id}`;
    } while (this.schedulerStatus$.value.jobs.findIndex(p => p.name === name) !== -1);

    return name;
  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));
}

