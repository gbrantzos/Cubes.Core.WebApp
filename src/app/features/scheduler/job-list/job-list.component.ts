import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  SchedulerJob,
  SchedulerStatus,
} from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListComponent implements OnInit, OnDestroy {
  @Output() jobSelected = new EventEmitter<SchedulerJob>();
  @Output() newJob = new EventEmitter<void>();

  public status$: Observable<SchedulerStatus>;
  public selectedJob: string;
  private subs = new SubSink();

  constructor(private store: SchedulerStore) {}

  ngOnInit(): void {
    this.status$ = this.store.schedulerStatus;
    this.subs.sink = this.store.selectedJob.subscribe(
      (job) => (this.selectedJob = job?.name)
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSelect(job: SchedulerJob) {
    this.jobSelected.emit(job);
  }
  onNew() {
    this.newJob.emit();
  }
}
