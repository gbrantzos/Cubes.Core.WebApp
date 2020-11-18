import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { Role, User } from '@features/security/services/security.model';
import { DialogService } from '@shared/services/dialog.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SecurityApiClient {
  private dataUrl: string;
  private rolesUrl: string;
  constructor(private http: HttpClient, private dialog: DialogService, config: ConfigurationService) {
    this.dataUrl = `${config.apiUrl}/Users`;
    this.rolesUrl = `${config.apiUrl}/Roles`;
  }

  loadUsers(): Observable<User[]> {
    return this.http.get<UserDetailsCubes[]>(this.dataUrl).pipe(
      map((data) =>
        data.map((d) => {
          const toReturn: User = {
            userName: d.userName,
            displayName: d.displayName,
            email: d.email,
            roles: d.roles ? d.roles.join(', ') : '',
            changedPassword: ''
          };
          return toReturn;
        })
      ),
      catchError((error, _) => {
        console.error(error);
        this.dialog.snackError(`Failed to load users!\n\n${error.error.data}`);
        return of([]);
      })
    );
  }

  saveUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(this.dataUrl, {
      userDetails: {
        userName: user.userName,
        displayName: user.displayName,
        email: user.email,
        roles:
          user.roles
            ?.split(',')
            .map((r) => r.trim())
            .filter((r) => !!r) || [],
      } as UserDetailsCubes,
      password: user.changedPassword,
    });
  }

  deleteUser(userName: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.dataUrl}/${userName}`).pipe(
      catchError((error, _) => {
        console.error(error);
        this.dialog.snackError(`Failed to delete user!\n\n${error.error.data}`);
        return of(false);
      })
    );
  }

  loadRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesUrl).pipe(
      catchError((error, _) => {
        console.error(error);
        this.dialog.snackError(`Failed to load roles!\n\n${error.error.data || error.error}`);
        return of([]);
      })
    );
  }

  saveRoles(roles: Role[]): Observable<any> {
    return this.http.post(this.rolesUrl, { roles: roles });
  }
}

// Cubes model
interface UserDetailsCubes {
  userName: string;
  displayName: string;
  email?: string;
  roles: string[];
}
