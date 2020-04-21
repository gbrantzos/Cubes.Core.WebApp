// cSpell:words cronstrue
import { AbstractControl } from '@angular/forms';
import cronstrue from 'cronstrue';

export class CustomValidators {
  static isJSON(control: AbstractControl) {
    const value = control.value;
    try {
      const jj = JSON.parse(value);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (!(jj && typeof jj === 'object')) { return { invalidJson: true }; }

      // Null means is valid
      return null;
    } catch (e) {
      return { invalidJson: true };
    }
  }

  static isCronExpression(control: AbstractControl) {
    const value = control.value;
    try {
      const tmp = cronstrue.toString(value, { throwExceptionOnParseError: true, use24HourTimeFormat: true });
      if (!tmp) { return { invalidCronExpression: true }; }
    } catch (e) {
      return { invalidCronExpression: true };
    }
    return null;
  }
}

