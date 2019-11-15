import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum CoreSchemas {
  SettingsSMTP   = 'Cubes.Core.Email.SmtpSettingsProfiles',
  DataConnection = 'Cubes.Core.DataAccess.Connection',
  DataQueries    = 'Cubes.Core.DataAccess.Query'
}

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  constructor(private httpClient: HttpClient) { }
  public getSchema(name: string): Observable<Schema> {
    return this.httpClient.get<Schema>(`ui/schema/${name}`);
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
  items?: OptionItem[];
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
