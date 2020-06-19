import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AvatarService } from '@core/services/avatar.service';
import { ConfigurationService } from '@core/services/configuration.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_ITEM = 'userDetails';

  constructor(
    private configService: ConfigurationService,
    private avatarService: AvatarService,
    private http: HttpClient
  ) {}

  get isLogged(): boolean {
    const details = this.loggedUser;
    if (!details) {
      return false;
    }

    const helper = new JwtHelperService();
    return !helper.isTokenExpired(details.token);
  }

  get loggedUser(): UserDetails {
    return JSON.parse(localStorage.getItem(this.STORAGE_ITEM)) as UserDetails;
  }
  set loggedUser(details: UserDetails) {
    localStorage.setItem(this.STORAGE_ITEM, JSON.stringify(details));
  }

  login(user: UserCredentials): Observable<void> {
    const helper = new JwtHelperService();
    const authenticateUrl = `${this.configService.apiUrl}/Users/authenticate`;
    return this.http
      .post<AuthenticateUserResponse>(authenticateUrl, {
        userName: user.userID,
        password: user.password,
      })
      .pipe(
        map((r) => {
          const details: UserDetails = {
            userID:   user.userID,
            fullName: r.displayName,
            token:    r.token,
            avatar:   this.avatarService.getAvatarUrl(r.email),
          };
          if (!r.roles.includes('admin')) {
            throw new Error('User must have administrator rights!');
          }

          console.log(`Successful login for user ${r.displayName}`);
          console.log(`Your token expires at ${helper.getTokenExpirationDate(r.token)}`);
          this.loggedUser = details;
          return;
        }),
        catchError((error, _) => {
          console.error(error);
          return throwError(error.error?.message || error.message);
        })
      );
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
  userID:   string;
  fullName: string;
  avatar:   string;
  token:    string;
}

// prettier-ignore
interface AuthenticateUserResponse {
  userName:    string;
  displayName: string;
  email:       string;
  token:       string;
  roles:       string[];
}
