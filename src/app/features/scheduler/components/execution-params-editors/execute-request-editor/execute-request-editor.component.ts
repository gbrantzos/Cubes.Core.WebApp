import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ParametersEditor } from '../execution-params-editors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lookup } from '@shared/services/lookup.service';
import { JobParameters } from 'src/app/core/services/scheduler.service';

@Component({
  selector: 'cubes-execute-request-editor',
  templateUrl: './execute-request-editor.component.html',
  styleUrls: ['./execute-request-editor.component.scss', '../common-styles.scss']
})
export class ExecuteRequestEditorComponent implements OnInit, ParametersEditor {
  @Input() parameters: string;
  @Input() requestsLookup: Lookup;
  @Output() validChanged: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;

  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    this.form = this.fb.group({
      requestType: ['', Validators.required],
      requestInst: ['', Validators.required]
    });
    this.form
      .statusChanges
      .subscribe(res => this.validChanged.emit(this.form.valid));

    if (!this.parameters) {
      setTimeout(() => this.validChanged.emit(false), 100);
      return;
    }
    this.form.patchValue({
      requestType: this.parameters['RequestType'],
      requestInst: this.parameters['RequestInstance']
    });
  }

  get requestType() { return this.form.get('requestType'); }
  get requestInst() { return this.form.get('requestInst'); }

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
}
