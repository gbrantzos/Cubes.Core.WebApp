import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SettingsStore {
  private readonly smtpProfiles$ = new BehaviorSubject<SmtpProfile[]>([]);
  private readonly selectedSmtpProfile$ = new BehaviorSubject<SmtpProfile>(undefined);

  readonly smtpProfiles = this.smtpProfiles$.asObservable();
  readonly selectedSmtpProfile = this.selectedSmtpProfile$.asObservable();

  constructor() {
  }

  loadData = () => {
    const profile: SmtpProfile = {
      name: 'Default',
      comments: 'Default SMTP profile',
      host: 'localhost',
      port: 25,
      timeout: 300,
      sender: 'nobody@localhost',
      useSsl: false
    };
    this.smtpProfiles$.next([profile]);
  }

  selectProfile(name: string) {
    const smtp = this.smtpProfiles$
      .value
      .find(s => s.name === name);
    this.selectedSmtpProfile$.next({ ...smtp });
  }
}

export interface SmtpProfile {
  name: string;
  comments?: string;
  host: string;
  port: number;
  timeout: number;
  sender: string;
  useSsl: boolean;
  userName?: string;
  password?: string;
  isNew?: boolean;
}
