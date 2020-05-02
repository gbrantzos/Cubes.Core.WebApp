import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { add } from 'date-fns';
import { ConfigurationService } from '@core/services/configuration.service';
import { AvatarService } from '@core/services/avatar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_ITEM = 'userDetails';
  private readonly hoursBeforeExpire = 10;

  constructor(private configService: ConfigurationService, private avatarService: AvatarService) { }

  get isLogged(): boolean {
    const details = this.loggedUser;
    if (!details) { return false; }

    const beforeExpiration = Date.parse(details.loginExpiration.toString()) > Date.now();
    if (beforeExpiration) {
      const newExpiration = add(new Date(), { hours: this.hoursBeforeExpire });
      this.loggedUser = {
        ...details,
        loginExpiration: newExpiration
      };
    }
    return beforeExpiration;
  }

  get loggedUser(): UserDetails {
    return JSON.parse(localStorage.getItem(this.STORAGE_ITEM)) as UserDetails;
  }
  set loggedUser(details: UserDetails) {
    localStorage.setItem(this.STORAGE_ITEM, JSON.stringify(details));
  }

  login(user: UserCredentials): Observable<void> {
    const subject = new BehaviorSubject<void>(null);

    const userFound = this.configService
      .users
      .find(u => u.userID === user.userID && u.password === user.password);
    if (userFound) {
      const details: UserDetails = {
        userID:          user.userID,
        fullName:        userFound.fullName,
        loginExpiration: add(new Date(), { hours: this.hoursBeforeExpire }),
        avatar:          this.avatarService.getAvatarUrl(userFound.email)
      };
      this.loggedUser = details;
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

// prettier-ignore
export interface UserCredentials {
  userID:   string;
  password: string;
}

// prettier-ignore
export interface UserDetails {
  userID:          string;
  fullName:        string;
  loginExpiration: Date;
  avatar:          string;
}
