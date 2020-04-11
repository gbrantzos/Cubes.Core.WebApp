import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob, isSchedulerJob } from 'src/app/core/services/scheduler.service';
import { MatDialog } from '@angular/material/dialog';
import { JobEditorComponent } from '../job-editor/job-editor.component';
import { Lookup } from '@shared/services/lookup.service';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Input() jobs: SchedulerJob[] | null;
  @Input() started: boolean;
  @Input() lookups: Lookup[];

  @Output() schedulerControl = new EventEmitter();
  @Output() modifyJob = new EventEmitter<JobModifyEvent>();
  @Output() runJob = new EventEmitter<SchedulerJob>();

  constructor(private dialog: MatDialog) { }
  ngOnInit() { }

  onSchedulerControl(menuItem: string) { this.schedulerControl.emit(menuItem); }
  onRunJob(job: SchedulerJob) { this.runJob.emit(job); }
  onEditJob(job: SchedulerJob) {
    // New asked, prepare en empty job
    const isNew = !job;
    const initialName = job.description;
    if (isNew) { job = this.newJob(); }

    // Open editor
    this.dialog.open(JobEditorComponent, {
      data: {
        job: job,
        lookups: this.lookups,
        existing: this.jobs.map(j => j.description),
        isNew
      },
      minWidth: 640
    }).afterClosed()
      .subscribe(resJob => {
        const event = {} as JobModifyEvent;
        if (isSchedulerJob(resJob)) {
          event.job = resJob;
          if (initialName && resJob.description !== initialName) {
            event.initialName = initialName;
          }
        } else if (typeof resJob === 'string' && resJob.startsWith('DELETE:')) {
          event.jobId = resJob.substr(7);
        } else { // Nothing to do...
          return;
        }
        this.modifyJob.emit(event);
      });
  }

  private newJob() {
    const maxID = Math.max(...this.jobs.map(m => Number(m.id)), 0) + 1;
    return <SchedulerJob>{
      id: maxID.toString(),
      description: `New scheduler job - ${maxID}`,
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
  initialName?: string;
}
