import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Connection } from './settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataConnectionService {
  private urlRoot = 'api/data/connections';

  constructor(private httpClient: HttpClient) { }

  public testConnection(connection: Connection): Observable<string> {
    const url = `${this.urlRoot}/test`;
    return this
      .httpClient
      .post<string>(url, connection);
  }
}
