import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loader$ = new Subject<LoaderStatus>();
  public loaderState = this.loader$.asObservable();

  // Based on https://medium.com/@zeljkoradic/loader-bar-on-every-http-request-in-angular-6-60d8572a21a9
  constructor() { }

  show() { this.loader$.next({ show: true }); }
  hide() { this.loader$.next({ show: false }); }
}

export interface LoaderStatus {
  show: boolean;
}
