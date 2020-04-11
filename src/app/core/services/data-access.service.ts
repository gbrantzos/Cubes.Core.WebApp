import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Connection, Query } from './settings.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  private urlRoot = '/api/data';

  constructor(private httpClient: HttpClient) { }

  public testConnection(connection: Connection): Observable<string> {
    const url = `${this.urlRoot}/connections/test`;
    return this
      .httpClient
      .post<string>(url, connection);
  }

  public executeQuery(query: Query, connectionName: string): Observable<any> {
    const url = `${this.urlRoot}/queries/${connectionName}`;
    return this
      .httpClient
      .post<any>(url, query);
  }

  public getExportSettings(): Observable<ExportSettings> {
    return this
      .httpClient
      .get<ExportSettings>(`${this.urlRoot}/exportSettings`);
  }

  public setExportSettings(settings: ExportSettings): Observable<string> {
    return this
      .httpClient
      .post<string>(`${this.urlRoot}/exportSettings`, settings);
  }
}

export interface ExportSettings {
  separator: string;
  includeHeaders: boolean;
}
