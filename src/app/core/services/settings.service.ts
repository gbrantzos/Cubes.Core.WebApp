import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

let memoryProfiles: SmtpSettings[];
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }
  public getSmtp(): Observable<SmtpSettings[]> {
    return of(memoryProfiles || []).pipe(
      map(result => result.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  public saveSmtp(profiles: SmtpSettings[]): Observable<string> {
    memoryProfiles = profiles;
    return of('SMTP profiles saved');
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
