import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataAccessSettings, Connection } from '@features/data-access/services/data-access.store';

@Injectable()
export class DataAccessApiClient {
  private readonly configUrl: String = 'api/configuration';
  private readonly dataUrl: String = 'api/data';

  constructor(private http: HttpClient) { }

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
}
