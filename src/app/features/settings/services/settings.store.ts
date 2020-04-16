import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SettingsApiClient } from '@features/settings/services/settings.api-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { flatMap, map, finalize, tap } from 'rxjs/operators';

@Injectable()
export class SettingsStore {
  private readonly smtpProfiles$ = new BehaviorSubject<SmtpProfile[]>([]);
  private readonly selectedSmtpProfile$ = new BehaviorSubject<SmtpProfile>(undefined);

  readonly smtpProfiles = this.smtpProfiles$.asObservable();
  readonly selectedSmtpProfile = this.selectedSmtpProfile$.asObservable();

  private readonly loaderDelay = 500;

  constructor(
    private apiClient: SettingsApiClient,
    private spinner: NgxSpinnerService
  ) { }

  loadData = () => {
    const call$ = this.apiCallWrapper(
      this.apiClient.loadData(),
      data => {
        this.smtpProfiles$.next(data);
        this.selectedSmtpProfile$.next(undefined);      }
    );
    call$.subscribe();
  }

  saveData = () => {
    const call$ = this.apiCallWrapper(
      this.apiClient.saveData(this.smtpProfiles$.value)
    );
    call$.subscribe();
  }

  selectProfile(name: string) {
    const smtp = this.smtpProfiles$
      .value
      .find(s => s.name === name);
    this.selectedSmtpProfile$.next({ ...smtp });
  }

  newProfile() {
    const name = this.uniqueName();
    const smtp: SmtpProfile = {
      name: name,
      comments: 'New SMTP Profile',
      host: 'localhost',
      port: 25,
      timeout: 300,
      sender: 'nobody@localhost',
      useSsl: false,
      isNew: true
    };
    this.selectedSmtpProfile$.next(smtp);
  }

  discardNewProfile = () => this.selectedSmtpProfile$.next(undefined);

  deleteProfile(name: string) {
    const temp = this.smtpProfiles$
      .value
      .filter(cnx => cnx.name !== name)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.smtpProfiles$.next(temp);
    this.selectedSmtpProfile$.next(undefined);
    this.saveData();
  }

  saveProfile(originalName: string, profile: SmtpProfile) {
    const temp = this.smtpProfiles$
      .value
      .filter(qry => qry.name !== originalName);
      const newQryArray = [
        ...temp,
        profile
      ].sort((a, b) => a.name.localeCompare(b.name));

      this.smtpProfiles$.next(newQryArray);
      this.saveData();
  }

  private uniqueName() {
    let name = '';
    let id = this.smtpProfiles$.value.length;
    do {
      id ++;
      name = `Profile.#${id}`;
    } while (this.smtpProfiles$.value.findIndex(p => p.name === name) !== -1);

    return name;
  }

  private apiCallWrapper<T>(
    apiCall: Observable<T>,
    processor: (response: any) => void = null
  ): Observable<T> {
    let callFinished: boolean;
    let loaderVisible: boolean;

    const call$ = of<T>(null)
      .pipe(
        tap(_ => {
          callFinished = false;
          loaderVisible = false;
          // console.log('Starting API call');

          setTimeout(() => {
            if (!callFinished) {
              // console.log('Showing loader');
              this.spinner.show();
              loaderVisible = true;
            }
          }, this.loaderDelay);
        }),
        flatMap(() => apiCall),
        map(data => {
          if (processor) { processor(data); }
          return data;
        }),
        finalize(() => {
          callFinished = true;
          if (loaderVisible) {
            // console.log('Hide loader');
            this.spinner.hide();
          }

          // console.log('API call finished');
        })
      );

    return call$;
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
