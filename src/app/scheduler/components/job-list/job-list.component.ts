import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob, isSchedulerJob } from 'src/app/core/services/scheduler.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MatDialog } from '@angular/material';
import { JobEditorComponent } from '../job-editor/job-editor.component';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Input() jobs: SchedulerJob[] | null;
  @Input() started: boolean;

  @Output() menuClick = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService) { }
  ngOnInit() { }

  onMenuClicked(menuItem: string) {
    this.menuClick.emit(menuItem);
  }
  onRunJob(job: SchedulerJob) {
    this.dialogService.alert('Running ' + job.description);
  }
  onEditJob(job: SchedulerJob | string) {
    if (!job) {
      // New asked, prepare en empty job
      job = <SchedulerJob> {
        id: '00000000-0000-0000-0000-000000000000',
        description: 'New scheduler job',
        cronExpression: '0 0 0 ? * *',
        isActive: false,
        fireIfMissed: false,
        jobType: '',
        executionParameters: null
      };
    }

    this.dialog.open(JobEditorComponent, {
      data: {
        job: job
      },
      minWidth: 400
    }).afterClosed()
      .subscribe(resJob => {
        if (isSchedulerJob(resJob)) {
          // Edit job...
          this.dialogService.alert('Edited job and now save ' + (<SchedulerJob>job).description);
          console.log(resJob);
        } else if (typeof resJob === 'string' && resJob.startsWith('DELETE:')) {
          // Delete job...
          const jobId = resJob.substr(7);
          this.dialogService.alert('Delete job with id ' + jobId);
        }
      });
  }}
