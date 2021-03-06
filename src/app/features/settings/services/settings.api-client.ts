import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { SmtpProfile } from '@features/settings/services/settings.store';
import { DialogService } from '@shared/services/dialog.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SettingsApiClient {
  private readonly configUrl: string;

  constructor(private http: HttpClient, private dialog: DialogService, config: ConfigurationService) {
    this.configUrl = `${config.apiUrl}/configuration`;
  }

  loadData(): Observable<SmtpProfile[]> {
    const settings$ = this.http
      .get<SmtpSettingsProfiles>(`${this.configUrl}/Cubes.Core.Email.SmtpSettingsProfiles`)
      .pipe(
        map((result) =>
          result.profiles
            .map((pr) => {
              return {
                name: pr.name,
                comments: pr.comments,
                host: pr.host,
                port: pr.port,
                timeout: pr.timeout,
                sender: pr.sender,
                useSsl: pr.useSsl,
                userName: pr.credentials ? pr.credentials.userName : '',
                password: pr.credentials ? pr.credentials.password : '',
              } as SmtpProfile;
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        ),
        catchError((error, _) => {
          this.dialog.snackError(`Failed to load settings!\n\n${error.error}`);
          return of([]);
        })
      );

    return settings$;
  }

  saveData(data: SmtpProfile[]) {
    const settingsProfiles = data.map((pr) => {
      return {
        name: pr.name,
        comments: pr.comments,
        host: pr.host,
        port: pr.port,
        timeout: pr.timeout,
        sender: pr.sender,
        useSsl: pr.useSsl,
        credentials: pr.userName && pr.password ? { userName: pr.userName, password: pr.password } : null,
      };
    });
    const settings = { profiles: settingsProfiles } as SmtpSettingsProfiles;
    return this.http
      .post<string>(`${this.configUrl}/Cubes.Core.Email.SmtpSettingsProfiles`, settings, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      })
      .pipe(
        catchError((error, _) => {
          this.dialog.snackError(`Failed to save settings!\n\n${error.error}`);
          return of('');
        })
      );

    // This specific endpoint of cubes accepts plain text (string)!
  }
}

// Cubes model, used for server communication
interface SmtpSettingsProfiles {
  profiles: [
    {
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
    }
  ];
}
