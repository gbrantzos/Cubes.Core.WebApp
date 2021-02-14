import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobExecutionHistory } from '@features/scheduler/services/scheduler.models';
import { format } from 'date-fns';

@Component({
  selector: 'cubes-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.scss'],
})
export class ExecutionDetailsComponent implements OnInit {
  public executionDetails: JobExecutionHistory;
  private jobName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ExecutionDetailsComponent>) {
    this.executionDetails = data.executionDetails;
    this.jobName          = data.jobName;
  }
  ngOnInit(): void { }

  saveDetails() {
    const job = this.jobName.replace(/[/\\?%*:|"<>]/g, '-');
    const dateStr = format(new Date(), 'yyyyMMddHHmm');
    const fileName = `ExecutionDetails.${job}.${dateStr}.json`;
    const content = JSON.stringify(this.executionDetails, null, 2);
    const a = document.createElement('a');

    a.setAttribute('target', '_self');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(content));
    a.setAttribute('download', fileName);
    document.body.appendChild(a); // Required for FF

    a.click();
    document.body.removeChild(a);

    this.dialogRef.close();
  }
}
