import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormSchemaService {

  constructor() { }
  public getSchema(name: string): Observable<Schema> {
    return of(schema);
  }
}

export interface Schema {
  name: string;
  label?: string;
  items: SchemaItem[];
}

export interface SchemaItem {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'datepicker';
  textareaRows?: number;
  options?: Options;
  validators?: Validator[];
}

export interface Options {
  multipleOptions?: boolean;
  optionItems?: OptionItem[];
}

export interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface Validators {
  required?: boolean;
  min?: number;
  max?: number;
}

export interface Validator {
  name: 'min' | 'max' | 'required' | 'requiredTrue' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  parameters?: any;
}


// Demo data
const schema: Schema = {
  name: 'SmtpSettings',
  items: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      validators: [{ name: 'required' }]
    }, {
      key: 'host',
      label: 'Host',
      type: 'text',
      validators: [{ name: 'required' }]
    }, {
      key: 'port',
      label: 'Port',
      type: 'text',
      validators: [
        {
          name: 'min',
          parameters: 25
        },
        {
          name: 'required'
        }]
    }, {
      key: 'timeout',
      label: 'Timeout',
      type: 'text',
      validators: [{ name: 'required' }]
    }, {
      key: 'sender',
      label: 'Sender',
      type: 'text',
      validators: [{ name: 'required' }]
    }, {
      key: 'useSsl',
      label: 'Use SSL',
      type: 'checkbox'
    }, {
      key: 'userName',
      label: 'User name',
      type: 'text'
    }, {
      key: 'password',
      label: 'password',
      type: 'text'
    }
  ]
};
