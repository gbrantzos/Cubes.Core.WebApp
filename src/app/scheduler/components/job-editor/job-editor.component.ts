import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Lookup } from 'src/app/core/services/lookup.service';

@Component({
  selector: 'cubes-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss']
})
export class JobEditorComponent implements OnInit {
  public job: SchedulerJob;
  public jobForm: FormGroup;
  public jobTypeLookup: Lookup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobEditorComponent>,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.job = data.job;
    this.jobTypeLookup = data.jobTypeLookup;
  }
  ngOnInit() {
    this.jobForm = this.createJobForm();
    this.jobForm.patchValue(this.job);
  }

  private createJobForm(): FormGroup {
    const form = this.fb.group({
      description: '',
      cronExpression: '',
      isActive: false,
      fireIfMissed: false,
      jobType: ''
    });

    return form;
  }
  onClose(job: SchedulerJob) {
    this.dialogRef.close(job);
  }

  onDelete(job: SchedulerJob) {
    this.dialogService
      .confirm('You are about to delete job <strong>' + job.description + '</strong>!<br>Continue?')
      .subscribe(resultOk => {
        if (resultOk) { this.dialogRef.close('DELETE:' + job.id); }
      });
  }

  onJobFormSubmit(form: FormGroup) {
    Object.assign(this.job, form.value);
    console.log(this.job);

    this.dialogRef.close(this.job);
  }
}
