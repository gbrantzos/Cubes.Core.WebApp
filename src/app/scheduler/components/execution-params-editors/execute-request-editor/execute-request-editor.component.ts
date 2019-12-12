import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lookup } from '@src/app/shared/services/lookup.service';
import { ParametersEditor } from '../execution-params-editors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    const prmJson = JSON.parse(this.parameters);
    if (prmJson) {
      // Valid parameters, apply to form
      const tmp = JSON.parse(prmJson.CommandInstance);
      prmJson.CommandInstance = JSON.stringify(tmp, null, 2);
      this.form.patchValue({
        requestType: prmJson.CommandType,
        requestInst: prmJson.CommandInstance
      });
    } else {
      // Invalid parameters, just tell the world that form is invalid
      // God knows why we need this timeout...
      setTimeout(() => this.validChanged.emit(false), 100);
    }
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
  getParameters(): string {
    const toReturn = {
      RequestType: this.requestType.value,
      RequestInstance: this.requestInst.value
    };
    return JSON.stringify(toReturn);
  }
}
