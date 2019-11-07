import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }
  public getSmtp(): Observable<SmtpSettings[]> {
    const profile1: SmtpSettings = {
      name: 'Default',
      host: 'localhost',
      port: 25,
      timeout: 600,
      sender: 'no-reply@somewhere.com',
      useSsl: false,
      userName: 'user',
      password: 'password'
    };
    const profile2: SmtpSettings = {
      name: 'Gmail',
      host: 'gmail.com',
      port: 25,
      timeout: 600,
      sender: 'no-reply@somewhere.com',
      useSsl: false,
      userName: 'user',
      password: 'password'
    };

    return of([profile1, profile2]);
  }

  public saveSmtp(smtpCollection: SmtpSettings[]) {
    console.log('will save!', smtpCollection);
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
