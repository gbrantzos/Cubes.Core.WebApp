import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { Schema } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsSettingsService {
  private readonly uiUrl: string;
  private readonly apiUrl: string;

  constructor(private http: HttpClient, config: ConfigurationService) {
    this.uiUrl = config.uiUrl;
    this.apiUrl = config.apiUrl;
  }

  getUIConfig(): Observable<ApplicationSettingsUIConfig[]> {
    const url = `${this.uiUrl}/applications-settings`;
    return this.http.get<ApplicationSettingsUIConfig[]>(url);
  }

  getSettingsData(settingsType: string) {
    const url = `${this.apiUrl}/configuration/${settingsType}`;
    return this.http.get(url);
  }
}

export interface ApplicationSettingsUIConfig {
  displayName: string;
  settingsTypeName: string;
  uiSchema: ComplexSchema;
  assemblyName: string;
  assemblyPath: string;
}

export interface ComplexSchema {
  [name: string]: {
    schema: Schema;
    isList: boolean;
    listItem?: string;
    listItemSub?: string;
    listIcon?: string;
  };
}
