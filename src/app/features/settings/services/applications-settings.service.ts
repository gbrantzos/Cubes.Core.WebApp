import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { Schema } from '@shared/services/schema.service';
import { Observable } from 'rxjs';

@Injectable()
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

  saveSettingsData(settingsType: string, settingsInstance) {
    const url = `${this.apiUrl}/configuration`;
    return this.http
      .post<string>(`${url}/${settingsType}`, settingsInstance, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      });
  }
}

// prettier-ignore
export interface ApplicationSettingsUIConfig {
  displayName:      string;
  settingsTypeName: string;
  uiSchema:         ComplexSchema;
  assemblyName:     string;
  assemblyPath:     string;
}

// prettier-ignore
export interface ComplexSchema {
  name: string;
  sections: [{
    rootProperty: string;
    schema:       Schema;
    isList:       boolean;
    listItem?:    string;
    listItemSub?: string;
    listIcon?:    string;
  }];
}
