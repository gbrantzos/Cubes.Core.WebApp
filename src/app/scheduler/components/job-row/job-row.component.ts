import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob, isSchedulerJob } from 'src/app/core/services/scheduler.service';
import { MatDialog } from '@angular/material';
import { JobEditorComponent } from '../job-editor/job-editor.component';

@Component({
  selector: 'cubes-job-row',
  templateUrl: './job-row.component.html',
  styleUrls: ['./job-row.component.scss']
})
export class JobRowComponent implements OnInit {
  @Input() job: SchedulerJob | null;

  @Output() saveJob: EventEmitter<SchedulerJob> = new EventEmitter();
  @Output() deleteJob: EventEmitter<string> = new EventEmitter();
  @Output() runJob: EventEmitter<SchedulerJob> = new EventEmitter();

  constructor(private dialog: MatDialog) { }
  ngOnInit() { }

  onRunJob(job: SchedulerJob) {
    this.runJob.emit(job);
  }
  onSaveJob(job: SchedulerJob) {
    this.dialog.open(JobEditorComponent, {
      data: {
        job: job
      },
      minWidth: 400
    }).afterClosed()
      .subscribe(resJob => {
        if (isSchedulerJob(resJob)) {
          this.saveJob.emit(resJob);
        } else if (typeof resJob === 'string' && resJob.startsWith('DELETE:')) {
          this.deleteJob.emit(resJob.substr(7));
        }
      });
  }

}
