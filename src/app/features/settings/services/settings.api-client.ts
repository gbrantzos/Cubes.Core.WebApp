import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogService } from '@shared/services/dialog.service';
import { SmtpProfile } from '@features/settings/services/settings.store';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable()
export class SettingsApiClient {
  private readonly configUrl: String = 'api/configuration';

  constructor(
    private http: HttpClient,
    private dialog: DialogService
  ) { }

  loadData(): Observable<SmtpProfile[]> {
    const settings$ = this
      .http
      .get<SmtpSettingsProfiles>(`${this.configUrl}/Cubes.Core.Email.SmtpSettingsProfiles`)
      .pipe(
        map(result => result
          .profiles
          .map(pr => {
            return {
              name: pr.name,
              comments: pr.comments,
              host: pr.host,
              port: pr.port,
              timeout: pr.timeout,
              sender: pr.sender,
              useSsl: pr.useSsl,
              userName: pr.credentials ? pr.credentials.userName : '',
              password: pr.credentials ? pr.credentials.password : ''
            } as SmtpProfile;
          })
          .sort((a, b) => a.name.localeCompare(b.name))
        ),
        catchError((error, _) => {
          this.dialog.alert(error.error);
          return of([]);
        })
      );

    return settings$;
  }

  saveData(data: SmtpProfile[]) {
    const settingsProfiles = data.map(pr => {
      return {
        name: pr.name,
        comments: pr.comments,
        host: pr.host,
        port: pr.port,
        timeout: pr.timeout,
        sender: pr.sender,
        useSsl: pr.useSsl,
        credentials: (pr.userName && pr.password) ? { userName: pr.userName, password: pr.password } : null
      };
    });
    const settings = { profiles: settingsProfiles } as SmtpSettingsProfiles;
    return this
      .http
      .post<string>(`${this.configUrl}/Cubes.Core.Email.SmtpSettingsProfiles`, settings, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
      });
    // This specific endpoint of cubes accepts plain text (string)!
  }
}

// Cubes model, used for server communication
interface SmtpSettingsProfiles {
  profiles: [{
    name: string;
    comments?: string;
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
