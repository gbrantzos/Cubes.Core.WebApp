import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParametersEditor } from '@features/scheduler/params-editors/execution-params-editors';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { JobParameters } from '@features/scheduler/services/scheduler.models';
import { DialogService } from '@shared/services/dialog.service';
import { Lookup } from '@shared/services/lookup.service';
import { CustomValidators } from '@core/helpers/custom-validators';

@Component({
  selector: 'cubes-execute-request-editor',
  templateUrl: './execute-request-editor.component.html',
  styleUrls: ['./execute-request-editor.component.scss', '../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecuteRequestEditorComponent implements OnInit, ParametersEditor {
  @Input() parameters: string;
  @Input() requestsLookup: Lookup;
  @Output() validChanged: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;
  public requestTypeProvider: string;

  constructor(private fb: FormBuilder, private client: SchedulerApiClient, private dialogService: DialogService) {}
  ngOnInit() {
    this.form = this.fb.group({
      requestType: ['', Validators.required],
      requestInst: ['', [Validators.required, CustomValidators.isYaml]],
    });
    this.form.statusChanges.subscribe((res) => this.validChanged.emit(this.form.valid));
    this.form.get('requestType').valueChanges.subscribe((v) => {
      this.requestTypeProvider = this.requestsLookup.items.find((i) => i.value === v)?.otherData;
    });

    if (!this.parameters) {
      setTimeout(() => this.validChanged.emit(false), 100);
      return;
    }
    this.form.patchValue({
      requestType: this.parameters['RequestType'],
      requestInst: this.parameters['RequestInstance'],
    });
  }

  get requestType() {
    return this.form.get('requestType');
  }
  get requestInst() {
    return this.form.get('requestInst');
  }

  get requestInstErrorMessage() {
    if (this.requestInst.getError('required')) {
      return 'Request Instance is required';
    } else if (this.requestInst.getError('invalidJson')) {
      return 'Request Instance is not valid JSON';
    }
    return 'Field failed validation, but why?';
  }

  // ParametersEditor implementation
  getParameters(): JobParameters {
    const toReturn = {} as JobParameters;
    toReturn['RequestType'] = this.requestType.value;
    toReturn['RequestInstance'] = this.requestInst.value;

    return toReturn;
  }
  setParameters(params: JobParameters) {
    this.form.get('requestType').setValue(params['RequestType']);
    this.form.get('requestInst').setValue(params['RequestInstance']);
  }
  pendingChanges(): boolean {
    return !this.form.pristine;
  }
  markAsPristine() {
    this.form.markAsPristine();
  }

  async getSample(event: MouseEvent) {
    event.stopPropagation();

    if (this.form.get('requestInst')) {
      const dialogResult = await this.dialogService
        .confirm('You are about to replace existing request instance with sample.\nReplace and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }

    if (this.requestTypeProvider) {
      this.client.getSample(this.requestTypeProvider).subscribe((data) => {
        this.form.get('requestInst').setValue(data);
      });
    }
  }
}
