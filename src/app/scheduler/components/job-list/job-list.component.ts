import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Input() jobs: SchedulerJob[] | null;
  @Input() started: boolean;

  @Output() menuClick = new EventEmitter();

  constructor(private dialogService: DialogService) { }
  ngOnInit() { }

  onMenuClicked(menuItem: string) {
    this.menuClick.emit(menuItem);
  }
  onRunJob(job: SchedulerJob) {
    this.dialogService.alert('Run ' + job.description);
  }
  onSaveJob(job: SchedulerJob) {
    this.dialogService.alert('Save ' + job.description);
  }
  onDeleteJob(jobId: string) {
    this.dialogService.alert('Delete ' + jobId);
  }
}
