import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum CoreSettings {
  SMTP = 'Cubes.Core.Email.SmtpSettingsProfiles',
  DATA = 'Cubes.Core.DataAccess.DataAccessSettings'
}
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly rootUrl: String = 'api/configuration';

  constructor(private httpClient: HttpClient) { }
  public getSmtp(): Observable<SmtpSettings[]> {
    const settings$ = this
      .httpClient
      .get<SmtpSettingsProfiles>(`${this.rootUrl}/${CoreSettings.SMTP}`)
      .pipe(
        map(result => ((result as any).profiles as any[]).map(pr => {
          return {
            name    : pr.name,
            host    : pr.host,
            port    : pr.port,
            timeout : pr.timeout,
            sender  : pr.sender,
            useSsl  : pr.useSsl,
            userName: pr.credentials ? pr.credentials.userName : '',
            password: pr.credentials ? pr.credentials.password : ''
          } as SmtpSettings;
        })),
        map(result => result.sort((a, b) => a.name.localeCompare(b.name)))
      );

    return settings$;
  }

  public saveSmtp(profiles: SmtpSettings[]): Observable<string> {
    const settingsProfiles = profiles.map(pr => {
      return {
        name   : pr.name,
        host   : pr.host,
        port   : pr.port,
        timeout: pr.timeout,
        sender : pr.sender,
        useSsl : pr.useSsl,
        credentials: (pr.userName && pr.password) ? { userName: pr.userName, password: pr.password } : null
      };
    });
    const settings = { profiles: settingsProfiles } as SmtpSettingsProfiles;
    return this
      .httpClient
      .post<string>(`${this.rootUrl}/${CoreSettings.SMTP}`, settings, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
      });
      // This specific endpoint of cubes accepts plain text (string)!
  }

  public getDataAccess(): Observable<DataAccessSettings> {
    return this
      .httpClient
      .get<DataAccessSettings>(`${this.rootUrl}/${CoreSettings.DATA}`)
      .pipe(
        map(result => {
          const toReturn =  {
            connections: result.connections.sort((a, b) => a.name.localeCompare(b.name)),
            queries: result.queries.sort((a, b) => a.name.localeCompare(b.name))
          } as DataAccessSettings;
          toReturn
            .connections
            .map((cnx, index) => cnx.id = index + 1);
          toReturn
            .queries
            .map((qr, index) => qr.id = index + 1);
          return toReturn;
        })
      );
  }

  public saveDataAccess(settings: DataAccessSettings): Observable<string> {
    return this
      .httpClient
      .post<string>(`${this.rootUrl}/${CoreSettings.DATA}`, settings, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
      });
      // This specific endpoint of cubes accepts plain text (string)!
  }
}

// ----------------------------------------------------------------------
export interface SmtpSettings {
  name: string;
  host: string;
  port: number;
  timeout: number;
  sender: string;
  useSsl: boolean;
  userName?: string;
  password?: string;
}

// Cubes model, used for server communication
interface SmtpSettingsProfiles {
  profiles: [{
    name: string;
    host: string;
    port: number;
    timeout: number;
    sender: string;
    useSsl: boolean;
    credentials: {
      userName?: string;
      password?: string;
    };
  }];
}
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// DataAccess models
export interface Connection {
  id?: number;
  name: string;
  comments?: string;
  connectionString: string;
  dbProvider: string;
}

export interface Query {
  id?: number;
  name: string;
  comments?: string;
  queryCommand: string;
  parameters?: any[];
}

export interface DataAccessSettings {
  connections: Connection[];
  queries: Query[];
}
// ----------------------------------------------------------------------
