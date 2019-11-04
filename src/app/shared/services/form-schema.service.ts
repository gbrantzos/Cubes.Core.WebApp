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
  options?: OptionItem[];
  multipleOptions?: boolean;
}

export interface OptionItem {
  label: string;
  value: string;
}
