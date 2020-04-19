import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { Observable, Subscription } from 'rxjs';
import { SchedulerStatus, SchedulerJob } from '@features/scheduler/services/scheduler.models';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobListComponent implements OnInit, OnDestroy {
  @Output() jobSelected = new EventEmitter<SchedulerJob>();
  @Output() newJob = new EventEmitter<void>();

  public status$: Observable<SchedulerStatus>;
  public selectedJob: string;

  private selectedJobSub: Subscription;

  constructor(private store: SchedulerStore) { }

  ngOnInit(): void {
    this.status$ = this.store.schedulerStatus;
    this.selectedJobSub = this.store
      .selectedJob
      .subscribe(job => this.selectedJob = job?.name);
  }
  ngOnDestroy(): void {
    if (this.selectedJobSub) { this.selectedJobSub.unsubscribe(); }
  }

  onSelect(job: SchedulerJob) { this.jobSelected.emit(job); }
  onNew() { this.newJob.emit(); }
}
