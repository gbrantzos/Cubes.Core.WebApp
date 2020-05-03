import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { ComplexSchema } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApplicationOptionsService {
  private readonly uiUrl: string;
  private readonly apiUrl: string;

  constructor(private http: HttpClient, config: ConfigurationService) {
    this.uiUrl = config.uiUrl;
    this.apiUrl = config.apiUrl;
  }

  getUIConfig(): Observable<ApplicationOptionsUIConfig[]> {
    const url = `${this.uiUrl}/applications-options`;
    return this.http.get<ApplicationOptionsUIConfig[]>(url).pipe(
      map((data) => {
        data.forEach(d => {
          d.uiSchema.sections.forEach(s => {
            if (s.isList && s.listDefinition?.icon) {
              const tmp = s.listDefinition.icon.split(' ');
              s.listDefinition.iconSet = tmp.length === 2 ? tmp[0] : 'fas';
              s.listDefinition.iconName = tmp.length === 2 ? tmp[1] : s.listDefinition.icon;
            }
          });
        });
        return data;
      })
    );
  }

  getSettingsData(settingsType: string) {
    const url = `${this.apiUrl}/configuration/${settingsType}`;
    return this.http.get(url);
  }

  saveSettingsData(settingsType: string, settingsInstance) {
    const url = `${this.apiUrl}/configuration`;
    return this.http.post<string>(`${url}/${settingsType}`, settingsInstance, {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
    });
  }

  resetSettingsData(settingsType: string): Observable<string> {
    const url = `${this.apiUrl}/configuration/${settingsType}/reset`;
    return this.http.get<string>(url);
  }
}

// prettier-ignore
export interface ApplicationOptionsUIConfig {
  displayName:     string;
  optionsTypeName: string;
  uiSchema:        ComplexSchema;
  assemblyName:    string;
  assemblyPath:    string;
}
