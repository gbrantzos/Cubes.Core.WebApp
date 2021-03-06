import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomValidators } from '@core/helpers/custom-validators';
import { CronHelpComponent } from '@features/scheduler/cron-help/cron-help.component';
import { JobHistoryComponent } from '@features/scheduler/job-history/job-history.component';
import { ParametersEditor } from '@features/scheduler/params-editors/execution-params-editors';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { JobParameters, SchedulerJob } from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { DialogService } from '@shared/services/dialog.service';
import { LookupService, CoreLookups } from '@shared/services/lookup.service';
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
    private matDialog: MatDialog,
    private store: SchedulerStore,
    private client: SchedulerApiClient
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
      this.lookupService.getLookup(CoreLookups.SchedulerJobTypes),
      this.lookupService.getLookup(CoreLookups.RequestTypes)
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
      fireIfMissed: false,
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

  async onSave() {
    const job = this.jobFromForm();
    const existing = this.store.snapshot.jobs.find((s) => s.name === job.name);
    const willOverwrite = this.isNew ? existing : existing && existing.name !== this.originalName;
    if (willOverwrite) {
      const dialogResult = await this.dialogService
        .confirm(`Scheduler job with name '${job.name}' already exist.\nContinue and overwrite?`)
        .toPromise();
      if (!dialogResult) {
        return;
      }
      this.originalName = job.name;
    }
    this.store.saveJob(this.originalName, job);
    this.jobForm.markAsPristine();
    this.executionParameters.markAsPristine();
    this.isNew = false;
  }
  onExecute() {
    this.client.runSchedulerJob(this.originalName).subscribe((data) => {
      this.dialogService.snackInfo('Job was triggered!');
    }, (error) => {
      console.error(error);
      this.dialogService.snackError(`Failed to execute job!\n${error.error}`);
    });
  }

  onHistory() {
    this.matDialog.open(JobHistoryComponent, {
      minHeight: '520px',
      minWidth: '760px'
    });
  }

  cronHelp() {
    this.matDialog.open(CronHelpComponent, {
      maxHeight: '600px',
      maxWidth: '820px'
    });
  }

  private jobFromForm(): SchedulerJob {
    const currentValue: any = this.jobForm.value;

    // prettier-ignore
    return {
      name:                      currentValue.name,
      cronExpression:            currentValue.cronExpression,
      cronExpressionDescription: '',
      active:                    currentValue.active,
      fireIfMissed:              currentValue.fireIfMissed,
      jobType:                   currentValue.jobType,
      executionParameters:       this.executionParameters.getParameters(),
      isNew:                     false,
    } as SchedulerJob;
  }
}
