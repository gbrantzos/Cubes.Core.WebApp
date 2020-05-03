import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { DialogService } from '@shared/services/dialog.service';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

export enum CoreSchemas {
  SettingsSMTP   = 'Cubes.Core.Email.SmtpSettingsProfiles',
  DataConnection = 'Cubes.Core.DataAccess.Connection',
  DataQuery      = 'Cubes.Core.DataAccess.Query',
  StaticContent  = 'Cubes.Core.Web.StaticContent.Content',
}

interface Cache {
  [name: string]: Observable<Schema>;
}

@Injectable()
export class SchemaService {
  private baseUrl: string;
  private readonly cache: Cache = {};

  constructor(private httpClient: HttpClient, private dialogService: DialogService, config: ConfigurationService) {
    this.baseUrl = `${config.uiUrl}/schema`;
  }

  public getSchema(name: string): Observable<Schema> {
    const cached = this.cache[name];
    if (cached) {
      return cached;
    } else {
      const actual = this.actualCall(name);
      this.cache[name] = actual;
      return actual;
    }
  }

  private actualCall(name: string): Observable<Schema> {
    return this.httpClient.get<Schema>(`${this.baseUrl}/${name}`).pipe(
      shareReplay(1),
      catchError((error, _) => {
        console.error(`Failed to retrieve schema "${name}"`, error);
        // this.dialogService.snackWarning(`Failed to retrieve schema!\n\n"${name}"\n${error.error}`, 'Close');
        return of(undefined);
      })
    );
  }
}

// prettier-ignore
export interface Schema {
  name:   string;
  label?: string;
  items:  SchemaItem[];
}

// prettier-ignore
export interface SchemaItem {
  key:              string;
  label:            string;
  type:             'text' | 'textarea' | 'select' | 'checkbox' | 'datepicker' | 'password';
  className?:       string;
  textareaRows?:    number;
  textareaMaxRows?: number;
  options?:         Options;
  validators?:      Validator[];
  hint?:            string;
  flex?:            string;
}

// prettier-ignore
export interface Options {
  dynamic?:         boolean;
  lookupKey?:       string;
  multipleOptions?: boolean;
  items?:           OptionItem[];
}

// prettier-ignore
export interface OptionItem {
  label:     string;
  value:     string;
  disabled?: boolean;
}

// prettier-ignore
export interface Validators {
  required?: boolean;
  min?:      number;
  max?:      number;
}

export interface Validator {
  name: 'min' | 'max' | 'required' | 'requiredTrue' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  parameters?: any;
}

// prettier-ignore
export interface ComplexSchema {
  name: string;
  sections: [{
    rootProperty:    string;
    schema:          Schema;
    isList:          boolean;
    listDefinition?: ListDefinition
  }];
}

// prettier-ignore
export interface ListDefinition {
  item:         string;
  itemSub?:     string;
  itemSubExpr?: string;
  icon?:        string;
  iconSet?:     string;
  iconName?:    string;
}
