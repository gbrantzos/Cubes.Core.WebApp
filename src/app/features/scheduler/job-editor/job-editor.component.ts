import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomValidators } from '@core/helpers/custom-validators';
import { LookupService } from '@shared/services/lookup.service';
import { SchedulerJob } from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import cronstrue from 'cronstrue';


@Component({
  selector: 'cubes-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobEditorComponent implements OnInit {
  public isNew = false;
  public formValid = false;
  public jobTypeForSwitch: string;
  public job$: Observable<SchedulerJob>;
  public jobForm: FormGroup;
  public lookups$: Observable<any>;

  private originalName: string;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private store: SchedulerStore
  ) { }

  ngOnInit(): void {
    this.jobForm = this.createJobForm();
    this.job$ = this.store
      .selectedJob
      .pipe(
        map(job => {
          this.originalName = job?.name;
          this.isNew = job?.isNew ?? false;

          if (job) { this.jobForm.patchValue(job); }
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
            requestTypes
          };
        })
      );
    this.jobForm
      .get('jobType')
      .valueChanges
      .subscribe(value => this.jobTypeForSwitch = value);
    this.jobForm
      .statusChanges
      .subscribe(res => this.formValid = this.jobForm.valid);
  }

  private createJobForm(): FormGroup {
    const form = this.fb.group({
      name: ['', Validators.required],
      cronExpression: ['', [Validators.required, CustomValidators.isCronExpression]],
      active: false,
      fireIfMissed: { value: false, disabled: true },
      jobType: ['', Validators.required]
    });

    return form;
  }

  get name() { return this.jobForm.get('name'); }
  get cronExpression() { return this.jobForm.get('cronExpression'); }
  get jobType() { return this.jobForm.get('jobType'); }
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

  onParametersEditorValidChanged(editorValid: boolean) {
    this.formValid = this.jobForm.valid && editorValid;
  }

  onDelete() { }
  onSave() { }
  onExecute() { }
}
