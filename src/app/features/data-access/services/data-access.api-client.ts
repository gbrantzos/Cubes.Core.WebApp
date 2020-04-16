import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataAccessSettings, Connection, Query } from '@features/data-access/services/data-access.store';
import { DialogService } from '@shared/services/dialog.service';

@Injectable()
export class DataAccessApiClient {
  private readonly configUrl: String = 'api/configuration';
  private readonly dataUrl: String = 'api/data';

  constructor(
    private http: HttpClient,
    private dialog: DialogService
  ) { }

  loadData(): Observable<DataAccessSettings> {
    return this
      .http
      .get<DataAccessSettings>(`${this.configUrl}/Cubes.Core.DataAccess.DataAccessSettings`)
      .pipe(
        map(result => {
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
              })
          } as DataAccessSettings;
          return toReturn;
        }),
        catchError((error, _) => {
          this.dialog.alert(error.error);
          const empty: DataAccessSettings = {
            connections: [],
            queries: []
          };
          return of(empty);
        })
      );
  }

  saveData(data: DataAccessSettings): Observable<string> {
    // This specific endpoint of cubes accepts plain text (string)!
    return this
      .http
      .post<string>(`${this.configUrl}/Cubes.Core.DataAccess.DataAccessSettings`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
      });
  }

  testConnection(connection: Connection): Observable<string> {
    const url = `${this.dataUrl}/connections/test`;
    return this
      .http
      .post<string>(url, connection);
  }

  executeQuery(query: Query, connectionName: string): Observable<any> {
    const url = `${this.dataUrl}/queries/${connectionName}`;
    return this.http.post<any>(url, query);
  }

  getExportSettings(): Observable<ExportSettings> {
    return this
      .http
      .get<ExportSettings>(`${this.dataUrl}/exportSettings`);
  }

  setExportSettings(settings: ExportSettings): Observable<string> {
    return this
      .http
      .post<string>(`${this.dataUrl}/exportSettings`, settings);
  }
}

export interface ExportSettings {
  separator: string;
  includeHeaders: boolean;
}
