import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob, isSchedulerJob } from 'src/app/core/services/scheduler.service';
import { MatDialog } from '@angular/material/dialog';
import { JobEditorComponent } from '../job-editor/job-editor.component';
import { Lookup } from '@src/app/shared/services/lookup.service';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Input() jobs: SchedulerJob[] | null;
  @Input() started: boolean;
  @Input() autoReload: boolean;
  @Input() lookups: Lookup[];

  @Output() schedulerControl = new EventEmitter();
  @Output() modifyJob = new EventEmitter<JobModifyEvent>();
  @Output() runJob = new EventEmitter<SchedulerJob>();

  constructor(private dialog: MatDialog) { }
  ngOnInit() { }

  onSchedulerControl(menuItem: string) { this.schedulerControl.emit(menuItem); }
  onRunJob(job: SchedulerJob) { this.runJob.emit(job); }
  onEditJob(job: SchedulerJob | string) {
    // New asked, prepare en empty job
    if (!job) { job = this.newJob(); }

    // Open editor
    this.dialog.open(JobEditorComponent, {
      data: {
        job: job,
        lookups: this.lookups
      },
      minWidth: 640
    }).afterClosed()
      .subscribe(resJob => {
        const event: JobModifyEvent = { autoReload: this.autoReload || false };
        if (isSchedulerJob(resJob)) {
          event.job = resJob;
        } else if (typeof resJob === 'string' && resJob.startsWith('DELETE:')) {
          event.jobId = resJob.substr(7);
        } else { // Nothing to do...
          return;
        }
        this.modifyJob.emit(event);
      });
  }

  private newJob() {
    return <SchedulerJob>{
      id: '00000000-0000-0000-0000-000000000000',
      description: 'New scheduler job',
      cronExpression: '0 0 0 ? * *',
      isActive: false,
      fireIfMissed: false,
      jobType: '',
      executionParameters: null
    };
  }
}

export interface JobModifyEvent {
  job?: SchedulerJob;
  jobId?: string;
  autoReload: boolean;
}
