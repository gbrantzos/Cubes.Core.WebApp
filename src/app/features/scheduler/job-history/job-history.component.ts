import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExecutionDetailsComponent } from '@features/scheduler/execution-details/execution-details.component';
import { JobExecutionHistory, SchedulerJob } from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';

@Component({
  selector: 'cubes-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent implements OnInit {
  public currentJob: SchedulerJob;
  public displayColumns = ['failed', 'executedAt', 'message', 'details'];

  constructor(
    public store: SchedulerStore,
    private matDialog: MatDialog) {
    this.currentJob = this.store.currentJob;
   }

  ngOnInit(): void {
    this.store.loadExecutionHistory();
  }

  onDetails(details: JobExecutionHistory) {
    this.matDialog.open(ExecutionDetailsComponent, {
      maxWidth: '720px',
      maxHeight: '420px',
      data: {
        executionDetails: details,
        jobName: this.store.currentJob.name
      }
    });
  }
}
