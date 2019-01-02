import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss']
})
export class JobEditorComponent implements OnInit {
  public job: SchedulerJob;

  constructor(
    private dialogref: MatDialogRef<JobEditorComponent>,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) data) { this.job = data.job; }
  ngOnInit() { }

  onClose(job: SchedulerJob) { this.dialogref.close(job); }
  onDelete(job: SchedulerJob) {
    this.dialogService
      .confirm('You are about to delete job <strong>' + job.description + '</strong>!<br>Continue?')
      .subscribe(resultOk => {
        if (resultOk) { this.dialogref.close('DELETE:' + job.id); }
      });
  }
}
