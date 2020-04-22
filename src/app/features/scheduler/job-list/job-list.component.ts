import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SchedulerJob, SchedulerStatus } from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { DialogService } from '@shared/services/dialog.service';
import { format } from 'date-fns';
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

  constructor(private store: SchedulerStore, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.status$ = this.store.schedulerStatus;
    this.subs.sink = this.store.selectedJob.subscribe((job) => (this.selectedJob = job?.name));
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
  showError(job: SchedulerJob) {
    let dateStr = format(job.lastExecutionAt, 'dd/MM/yyyy HH:mm:ss');
    if (dateStr.endsWith(':00')) {
      dateStr = dateStr.substr(0, dateStr.length - 3);
    }
    const message =
      `Execution for job <strong>'${job.name}'</strong> failed!\n\n` +
      `Executed at: ${dateStr}\nError: ${job.lastExecutionMessage}`;
    this.dialogService.alert(message);
  }
}
