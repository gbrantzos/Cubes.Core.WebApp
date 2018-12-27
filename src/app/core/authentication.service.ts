import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Credentials {
  username: string;

  // TODO: You can add all other usefull properties here.
  token: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'CubesCredentials';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _creadentials: Credentials | null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._creadentials = JSON.parse(savedCredentials);
    }
  }

  login(context: LoginContext): Observable<Credentials> {
    // TODO: Add login logic
    const data = {
      username: context.username,
      token: 'this is a token'
    };
    this.setCredentials(data);
    return of(data);
  }

  logout(): Observable<boolean> {
    // TODO: Add loggout logic
    this.setCredentials();
    return of(true);
  }

  isAuthenticated(): boolean { return !!this.credentials; }

  get credentials(): Credentials | null { return this._creadentials; }

  setCredentials(credentials?: Credentials, remember?: boolean): any {
    this._creadentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }

  }
}
