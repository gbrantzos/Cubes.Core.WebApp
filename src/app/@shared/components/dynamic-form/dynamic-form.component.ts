import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Schema, Validator } from '@shared/services/schema.service';


@Component({
  selector: 'cubes-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges, DynamicForm {
  @Input() schema: Schema;
  @Input() model: any;
  @Output() isValid = new EventEmitter<boolean>();
  @Output() modelChanged = new EventEmitter<any>();

  private _dirty = false;
  private _pristine = true;
  get dirty() { return this._dirty; }
  get pristine() { return this._pristine; }

  public form: FormGroup;

  constructor() { }
  ngOnInit() {
    this.prepareFormGroup();
    if (this.model) { this.loadModel(this.model); }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['schema']) { this.prepareFormGroup(); }
    if (!!changes['model']) { this.loadModel(this.model); }
  }

  public loadModel(model: any) {
    this.form?.patchValue(model);
    this.markAsPristine();
    this._dirty = false;
  }

  public markAsPristine() {
    this.form?.markAsPristine();
    this._pristine = true;
  }

  private prepareFormGroup() {
    const formGroup = {};

    for (const item of this.schema.items) {
      formGroup[item.key] = new FormControl('', { validators: this.mapValidators(item.validators), updateOn: 'blur' });
    }
    this.form = new FormGroup(formGroup);
    this.form.statusChanges.subscribe(status => {
      this.isValid.emit(status === 'VALID');
      this._dirty = this.form.dirty;
      this._pristine = this.form.pristine;
    });
    this.form.valueChanges.subscribe(model => this.modelChanged.next(model));
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
    if (control.errors.required) { errorMessage = `${keyName} is required`; }
    if (control.errors.min) { errorMessage = `${keyName} must be more than ${control.errors.min.min}`; }
    if (control.errors.max) { errorMessage = `${keyName} must be less than ${control.errors.max.max}`; }
    if (control.errors.minLength) { errorMessage = `${keyName} must be more than ${control.errors.min.minLength} characters`; }
    if (control.errors.maxLength) { errorMessage = `${keyName} must be less than ${control.errors.max.maxLength} characters`; }
    if (control.errors.pattern) { errorMessage = `${keyName} does not match required pattern`; }
    if (control.errors.email) { errorMessage = `${keyName} is not a valid email`; }

    return errorMessage;
  }

  private toCapitalFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  public currentValue() { return this.form.getRawValue(); }
}

export interface DynamicForm {
  readonly currentValue: any;
  form: FormGroup;
  loadModel(value: any): void;
}
