import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';

@Component({
  selector: 'cubes-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss']
})
export class JobEditorComponent implements OnInit {
  public job: SchedulerJob;

  constructor(
    private dialogref: MatDialogRef<JobEditorComponent>,
    @Inject(MAT_DIALOG_DATA) data) { this.job = data.job; }
  ngOnInit() { }

  onClose(job: SchedulerJob) { this.dialogref.close(job); }
  onDelete(job: SchedulerJob) { this.dialogref.close('DELETE:' + job.id); }
}
