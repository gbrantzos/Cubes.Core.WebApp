import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormSchemaService {

  constructor() { }
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
