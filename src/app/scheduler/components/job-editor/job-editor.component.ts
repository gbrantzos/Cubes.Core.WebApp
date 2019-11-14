import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lookup } from '@src/app/shared/services/lookup.service';
import { ParametersEditor } from '../execution-params-editors/execution-params-editors';
import { CustomValidators } from '../../custom-validators';
import cronstrue from 'cronstrue';


@Component({
  selector: 'cubes-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss']
})
export class JobEditorComponent implements OnInit {
  public job: SchedulerJob;
  public jobForm: FormGroup;
  public jobTypeForSwitch: string;
  public formValid = false;

  public lookups: Lookup;
  @ViewChild('executionParameters', { static: false }) executionParameters: ParametersEditor;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobEditorComponent>,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.job = data.job;
    this.lookups = data.lookups;
  }
  ngOnInit() {
    this.jobForm = this.createJobForm();
    this.jobForm
      .get('jobType')
      .valueChanges
      .subscribe(value => this.jobTypeForSwitch = value);
    this.jobForm
      .statusChanges
      .subscribe(res => this.formValid = this.jobForm.valid);

    this.jobForm.patchValue(this.job);
  }

  private createJobForm(): FormGroup {
    const form = this.fb.group({
      id            : '',
      description   : ['', Validators.required],
      cronExpression: ['', [Validators.required, CustomValidators.isCronExpression]],
      isActive      : false,
      fireIfMissed  : false,
      jobType       : ['', Validators.required]
    });

    return form;
  }

  get description()    { return this.jobForm.get('description'); }
  get cronExpression() { return this.jobForm.get('cronExpression'); }
  get jobType()        { return this.jobForm.get('jobType'); }
  get cronExpressionErrorMessage() {
    if (this.cronExpression.getError('required')) {
      return 'CronExpression is required';
    } else if (this.cronExpression.getError('invalidCronExpression')) {
      return 'Field is not valid Cron expression';
    }
    return 'Field failed validation, but why?';
  }
  get cronExpressionHint() {
    try {
      return cronstrue.toString(this.cronExpression.value);
    } catch (error) {
      return '';
    }
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
    const toSave = <Partial<SchedulerJob>>{};
    Object.assign(toSave, form.value);

    const parametersEditor = <ParametersEditor>this.executionParameters;
    toSave.executionParameters = parametersEditor.getParameters();

    Object.assign(this.job, toSave); // TO be removed!
    this.dialogRef.close(toSave);
  }

  onParametersEditorValidChanged(editorValid: boolean) {
    this.formValid = this.jobForm.valid && editorValid;
  }
}
