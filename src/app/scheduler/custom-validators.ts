import { AbstractControl } from '@angular/forms';
import cronstrue from 'cronstrue';

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
  const value = control.value;
  try {
    const tmp = cronstrue.toString(value);
    if (!tmp) { return { invalidCronExpression: true }; }
  } catch (e) {
    return { invalidCronExpression: true };
  }
  return null;
}
