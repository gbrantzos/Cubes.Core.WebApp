import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly rootUrl: String = 'api/configuration';
  private readonly smtpSettingsTypes: String = 'Cubes.Core.Email.SmtpSettingsProfiles';

  constructor(private httpClient: HttpClient) { }
  public getSmtp(): Observable<SmtpSettings[]> {
    const settings$ = this
      .httpClient
      .get<SmtpSettingsProfiles>(`${this.rootUrl}/${this.smtpSettingsTypes}`)
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
      .post<string>(`${this.rootUrl}/${this.smtpSettingsTypes}`, settings, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
      });
      // This specific endpoint of cubes accepts plain text (string)!
  }
}

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
