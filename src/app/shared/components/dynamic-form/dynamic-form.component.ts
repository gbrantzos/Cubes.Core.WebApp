import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Schema } from '../../services/form-schema.service';

@Component({
  selector: 'cubes-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, DynamicForm {
  @Input() schema: Schema;
  @Input() model: any;

  public form: FormGroup;

  constructor() { }
  ngOnInit() {
    const formGroup = {};

    for (const item of this.schema.items) {
      formGroup[item.key] = new FormControl(this.model[item.key] || '', this.mapValidators(item.validators));
    }
    this.form = new FormGroup(formGroup);
    this.form.patchValue(this.model);
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        } else if (validation === 'max') {
          formValidators.push(Validators.max(validators[validation]));
        }
      }
    }
    return formValidators;
  }

  compareObjects(o1: any, o2: any) {
    return typeof o2 === 'number' ?
      o1 === o2.toString() :
      o1 === o2;
  }

  public currentValue() { return this.form.getRawValue(); }
  public setModel(value: any) {
    this.model = value;
    this.form.patchValue(this.model);
  }
}

export interface DynamicForm {
  readonly currentValue: any;
  setModel(value: any): void;
}
