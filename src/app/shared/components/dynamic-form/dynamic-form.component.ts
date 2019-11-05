import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Schema, Validator } from '@src/app/shared/services/form-schema.service';


@Component({
  selector: 'cubes-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, DynamicForm {
  @Input() schema: Schema;
  @Input() model: any;
  @Output() isValid = new EventEmitter<boolean>();

  public form: FormGroup;

  constructor() { }
  ngOnInit() {
    const formGroup = {};

    for (const item of this.schema.items) {
      formGroup[item.key] = new FormControl(this.model[item.key] || '', this.mapValidators(item.validators));
    }
    this.form = new FormGroup(formGroup);
    this.form.statusChanges.subscribe(status => this.isValid.emit(status === 'VALID'));

    this.form.patchValue(this.model);
    this.form.markAllAsTouched();
  }

  private mapValidators(validators: Validator[]) {
    const formValidators = [];

    if (validators) {
      for (const validation of validators) {
        switch (validation.name) {
          case 'required':
            formValidators.push(Validators.required);
            break;
          case 'requiredTrue':
            formValidators.push(Validators.requiredTrue);
            break;
          case 'min':
            formValidators.push(Validators.min(validation.parameters));
            break;
          case 'max':
            formValidators.push(Validators.max(validation.parameters));
            break;
          case 'minLength':
            formValidators.push(Validators.minLength(validation.parameters));
            break;
          case 'maxLength':
            formValidators.push(Validators.maxLength(validation.parameters));
            break;
          case 'pattern':
            formValidators.push(Validators.pattern(validation.parameters));
            break;
          case 'email':
            formValidators.push(Validators.email);
            break;
        }
      }
    }
    return formValidators;
  }

  public compareObjects(o1: any, o2: any) {
    return typeof o2 === 'number' ?
      o1 === o2.toString() :
      o1 === o2;
  }

  public hasErrors(key: string): boolean {
    const control = this.form.controls[key];
    return control.invalid && (control.dirty || control.touched);
  }

  public getErrorMessage(key: string, label?: string): string {
    const control = this.form.controls[key];
    const keyName = label || this.toCapitalFirst(key);

    let errorMessage = `Errors with ${keyName}`;
    if (control.errors.required)     { errorMessage = `${keyName} is required`; }
    if (control.errors.min)          { errorMessage = `${keyName} must be more than ${control.errors.min.min}`; }
    if (control.errors.max)          { errorMessage = `${keyName} must be less than ${control.errors.max.max}`; }
    if (control.errors.minLength)    { errorMessage = `${keyName} must be more than ${control.errors.min.minLength} characters`; }
    if (control.errors.maxLength)    { errorMessage = `${keyName} must be less than ${control.errors.max.maxLength} characters`; }
    if (control.errors.pattern)      { errorMessage = `${keyName} does not match required pattern`; }
    if (control.errors.email)        { errorMessage = `${keyName} is not a valid email`; }

    return errorMessage;
  }

  private toCapitalFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
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
