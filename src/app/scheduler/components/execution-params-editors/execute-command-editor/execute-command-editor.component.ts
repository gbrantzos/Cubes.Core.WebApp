import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lookup } from 'src/app/core/services/lookup.service';
import { ParametersEditor } from '../execution-params-editors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/scheduler/custom-validators';

@Component({
  selector: 'cubes-execute-command-editor',
  templateUrl: './execute-command-editor.component.html',
  styleUrls: ['./execute-command-editor.component.scss', '../common-styles.scss']
})
export class ExecuteCommandEditorComponent implements OnInit, ParametersEditor {
  @Input() parameters: string;
  @Input() commandsLookup: Lookup;
  @Output() validChanged: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;

  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    this.form = this.fb.group({
      CommandType: ['', Validators.required],
      CommandInstance: ['', [Validators.required, CustomValidators.isJSON]]
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
      this.form.patchValue(prmJson);
    } else {
      // Invalid parameters, just tell the world that form is invalid
      // God knows why we need this timeout...
      setTimeout(() => this.validChanged.emit(false), 100);
    }
  }

  get CommandType() { return this.form.get('CommandType'); }
  get CommandInstance() { return this.form.get('CommandInstance'); }

  get commandInstErrorMessage() {
    if (this.CommandInstance.getError('required')) {
      return 'Command Instance is required';
    } else if (this.CommandInstance.getError('invalidJson')) {
      return 'Command Instance is not valid JSON';
    }
    return 'Field failed validation, but why?';
  }

  // ParametersEditor implementation
  getParameters(): string {
    const toReturn = {
      CommandType: this.CommandType.value,
      CommandInstance: JSON.stringify(JSON.parse(this.CommandInstance.value))
    };
    return JSON.stringify(toReturn);
  }
}
