import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@core/helpers/custom-validators';
import { ParametersEditor } from '@features/scheduler/params-editors/execution-params-editors';
import { JobParameters, SchedulerJob } from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { DialogService } from '@shared/services/dialog.service';
import { LookupService } from '@shared/services/lookup.service';
import cronstrue from 'cronstrue';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobEditorComponent implements OnInit {
  @ViewChild('executionParameters', { static: false }) executionParameters: ParametersEditor;
  public isNew = false;
  public formValid = false;
  public jobTypeForSwitch: string;
  public jobParameters: JobParameters;
  public job$: Observable<SchedulerJob>;
  public jobForm: FormGroup;
  public lookups$: Observable<any>;

  private originalName: string;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private dialogService: DialogService,
    private store: SchedulerStore
  ) {}

  ngOnInit(): void {
    this.jobForm = this.createJobForm();
    this.job$ = this.store.selectedJob.pipe(
      map((job) => {
        this.originalName = job?.name;
        this.isNew = job?.isNew ?? false;
        if (job) {
          this.jobForm.patchValue(job);
          if (job.executionParameters) {
            this.jobParameters = { ...job.executionParameters };
            setTimeout(() => this.executionParameters.setParameters(this.jobParameters), 100);
          }
        }
        return job;
      })
    );
    this.lookups$ = forkJoin(
      this.lookupService.getLookup('jobTypes'),
      this.lookupService.getLookup('requestTypes')
    ).pipe(
      map(([jobTypes, requestTypes]) => {
        return {
          jobTypes,
          requestTypes,
        };
      })
    );
    this.jobForm.get('jobType').valueChanges.subscribe((value) => (this.jobTypeForSwitch = value));
    this.jobForm.statusChanges.subscribe((res) => (this.formValid = this.jobForm.valid));
  }

  private createJobForm(): FormGroup {
    const form = this.fb.group({
      name: ['', Validators.required],
      cronExpression: ['', [Validators.required, CustomValidators.isCronExpression]],
      active: false,
      fireIfMissed: { value: false, disabled: true },
      jobType: ['', Validators.required],
    });

    return form;
  }

  get name() {
    return this.jobForm.get('name');
  }
  get cronExpression() {
    return this.jobForm.get('cronExpression');
  }
  get jobType() {
    return this.jobForm.get('jobType');
  }
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
      return cronstrue.toString(this.cronExpression.value, { use24HourTimeFormat: true });
    } catch (error) {
      return '';
    }
  }

  pendingChanges(): boolean {
    return this.jobForm && this.executionParameters
      ? !this.jobForm.pristine || this.executionParameters.pendingChanges()
      : false;
  }

  onParametersEditorValidChanged(editorValid: boolean) {
    this.formValid = this.jobForm.valid && editorValid;
  }

  onDelete() {
    if (this.isNew) {
      this.dialogService.confirm('Discard new job?').subscribe((r) => {
        if (r) {
          this.store.discardNewJob();
        }
      });
    } else {
      this.dialogService.confirm('Delete current job?').subscribe((r) => {
        if (r) {
          this.store.deleteJob(this.originalName);
        }
      });
    }
  }

  onSave() {
    const job = this.jobFromForm();
    this.store.saveJob(this.originalName, job);
    this.jobForm.markAsPristine();
    this.executionParameters.markAsPristine();
    this.isNew = false;
  }
  onExecute() {}

  private jobFromForm(): SchedulerJob {
    const currentValue: any = this.jobForm.value;
    return {
      name: currentValue.name,
      cronExpression: currentValue.cronExpression,
      cronExpressionDescription: '',
      active: currentValue.active,
      fireIfMissed: currentValue.fireIfMissed,
      jobType: currentValue.jobType,
      executionParameters: this.executionParameters.getParameters(),
      isNew: false,
    } as SchedulerJob;
  }
}
