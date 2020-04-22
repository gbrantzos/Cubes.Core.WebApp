import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { Connection, DataAccessSettings, Query } from '@features/data-access/services/data-access.store';
import { DialogService } from '@shared/services/dialog.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class DataAccessApiClient {
  private readonly configUrl: string;
  private readonly dataUrl: string;

  constructor(private http: HttpClient, private dialog: DialogService, config: ConfigurationService) {
    this.configUrl = `${config.apiUrl}/configuration`;
    this.dataUrl = `${config.apiUrl}/data`;
  }

  loadData(): Observable<DataAccessSettings> {
    return this.http.get<DataAccessSettings>(`${this.configUrl}/Cubes.Core.DataAccess.DataAccessSettings`).pipe(
      map((result) => {
        const toReturn = {
          connections: result.connections
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cnx, index) => {
              cnx.id = index + 1;
              return cnx;
            }),
          queries: result.queries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((query, index) => {
              query.id = index + 1;
              return query;
            }),
        } as DataAccessSettings;
        return toReturn;
      }),
      catchError((error, _) => {
        this.dialog.snackError(`Failed to load data access settings!\n\n${error.error}`);
        const empty: DataAccessSettings = {
          connections: [],
          queries: [],
        };
        return of(empty);
      })
    );
  }

  saveData(data: DataAccessSettings): Observable<string> {
    // This specific endpoint of cubes accepts plain text (string)!
    return this.http
      .post<string>(`${this.configUrl}/Cubes.Core.DataAccess.DataAccessSettings`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      })
      .pipe(
        catchError((error, _) => {
          this.dialog.snackError(`Failed to load data access settings!\n\n${error.error}`);
          return of('');
        })
      );
  }

  testConnection(connection: Connection): Observable<string> {
    const url = `${this.dataUrl}/connections/test`;
    return this.http.post<string>(url, connection);
  }

  executeQuery(query: Query, connectionName: string, params?: any[]): Observable<any> {
    let httpParams = new HttpParams();
    const nullValues = [];
    if (params) {
      params.forEach((prm) => {
        if (prm.value) {
          httpParams = httpParams.set(prm.name, prm.value);
        } else {
          httpParams = httpParams.set(prm.name, 'ignore');
          nullValues.push(prm.name);
        }
      });
      if (nullValues.length > 0) {
        nullValues.forEach((nvl) => {
          httpParams = httpParams.append('nulls', nvl);
        });
      }
    }
    const url = `${this.dataUrl}/queries/${connectionName}`;
    return this.http.post<any>(url, query, { params: httpParams });
  }

  getExportSettings(): Observable<ExportSettings> {
    return this.http.get<ExportSettings>(`${this.dataUrl}/exportSettings`);
  }

  setExportSettings(settings: ExportSettings): Observable<string> {
    return this.http.post<string>(`${this.dataUrl}/exportSettings`, settings);
  }
}

export interface ExportSettings {
  separator: string;
  includeHeaders: boolean;
}
