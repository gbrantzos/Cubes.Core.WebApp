import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { add } from 'date-fns';
import { Md5 } from 'ts-md5/dist/md5';
import { ConfigurationService } from '@core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_ITEM = 'userDetails';
  private md5 = new Md5();

  constructor(private configService: ConfigurationService) { }

  get isLogged(): boolean {
    const details = this.loggedUser;
    if (!details) { return false; }

    return Date.parse(details.loginExpiration.toString()) > Date.now();
  }

  get loggedUser(): UserDetails {
    return JSON.parse(localStorage.getItem(this.STORAGE_ITEM)) as UserDetails;
  }

  login(user: UserCredentials): Observable<void> {
    const subject = new BehaviorSubject<void>(null);

    const userFound = this.configService
      .users
      .find(u => u.userID === user.userID && u.password === user.password);
    if (userFound) {
      const details: UserDetails = {
        userID: user.userID,
        fullName: userFound.fullName,
        loginExpiration: add(new Date(), { hours: 10 }),
        avatar: userFound.email ?
          `https://www.gravatar.com/avatar/${this.md5.appendAsciiStr(userFound.email).end()}` :
          'assets/images/default-avatar.png'
      };
      localStorage.setItem(this.STORAGE_ITEM, JSON.stringify(details));
      setTimeout(() => {
        subject.next();
        subject.complete();
      }, 2000);
    } else {
      subject.error('Login failure!');
    }

    return subject.asObservable();
  }

  logout() {
    localStorage.removeItem(this.STORAGE_ITEM);
  }
}

export interface UserCredentials {
  userID: string;
  password: string;
}

export interface UserDetails {
  userID: string;
  fullName: string;
  loginExpiration: Date;
  avatar: string;
}
