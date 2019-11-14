import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lookup } from '@src/app/shared/services/lookup.service';
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
      commandType: ['', Validators.required],
      commandInst: ['', [
        Validators.required,
        CustomValidators.isJSON
      ]]
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
        commandType: prmJson.CommandType,
        commandInst: prmJson.CommandInstance
      });
    } else {
      // Invalid parameters, just tell the world that form is invalid
      // God knows why we need this timeout...
      setTimeout(() => this.validChanged.emit(false), 100);
    }
  }

  get commandType() { return this.form.get('commandType'); }
  get commandInst() { return this.form.get('commandInst'); }

  get commandInstErrorMessage() {
    if (this.commandInst.getError('required')) {
      return 'Command Instance is required';
    } else if (this.commandInst.getError('invalidJson')) {
      return 'Command Instance is not valid JSON';
    }
    return 'Field failed validation, but why?';
  }

  // ParametersEditor implementation
  getParameters(): string {
    const toReturn = {
      CommandType: this.commandType.value,
      CommandInstance: JSON.stringify(JSON.parse(this.commandInst.value))
    };
    return JSON.stringify(toReturn);
  }
}
