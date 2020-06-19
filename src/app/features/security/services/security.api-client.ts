import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { User } from '@features/security/services/security.model';
import { DialogService } from '@shared/services/dialog.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SecurityApiClient {
  private dataUrl: string;
  constructor(private http: HttpClient, private dialog: DialogService, config: ConfigurationService) {
    this.dataUrl = `${config.apiUrl}/Users`;
  }

  loadUsers(): Observable<User[]> {
    return this.http.get<UserDetailsCubes[]>(this.dataUrl).pipe(
      map((data) =>
        data.map((d) => {
          const toReturn: User = {
            userName:    d.userName,
            displayName: d.displayName,
            email:       d.email,
            roles:       d.roles ? d.roles.join(', ') : '',
          };
          return toReturn;
        })
      ),
      catchError((error, _) => {
        this.dialog.snackError(`Failed to load users!\n\n${error.error}`);
        return of([]);
      })
    );
  }

  saveUser(user: User): Observable<boolean> {
    return this.http
      .post<boolean>(this.dataUrl, {
        userDetails: {
          userName:    user.userName,
          displayName: user.displayName,
          email:       user.email,
          roles:       user.roles?.split(',').map(r => r.trim()).filter(r => !!r) || [],
        } as UserDetailsCubes,
        password: user.changedPassword,
      })
      .pipe(
        catchError((error, _) => {
          this.dialog.snackError(`Failed to save user details!\n\n${error.error}`);
          return of(false);
        })
      );
  }

  deleteUser(userName: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.dataUrl}/${userName}`).pipe(
      catchError((error, _) => {
        console.error(error);
        this.dialog.snackError(`Failed to delete user!\n\n${error.error.message}`);
        return of(false);
      })
    );
  }
}

// Cubes model
interface UserDetailsCubes {
  userName:    string;
  displayName: string;
  email?:      string;
  roles:       string[];
}
