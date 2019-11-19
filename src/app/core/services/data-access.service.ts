import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Connection, Query } from './settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  private urlRoot = 'api/data';

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
}
