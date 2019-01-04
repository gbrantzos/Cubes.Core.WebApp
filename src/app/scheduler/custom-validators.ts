import { AbstractControl } from '@angular/forms';

export function ValidateJSON(control: AbstractControl) {
  const value = control.value;
  try {
    JSON.parse(value);
    return null;
  } catch (e) {
    return { invalidJson: true };
  }
}

export function ValidateCronExpression(control: AbstractControl) {
  // TODO: Add validation
  return null;
}
