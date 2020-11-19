import { Injectable } from '@angular/core';
import { SecurityApiClient } from '@features/security/services/security.api-client';
import { Role, User } from '@features/security/services/security.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { BehaviorSubject, forkJoin } from 'rxjs';

@Injectable()
export class SecurityStore {
  private readonly roles$ = new BehaviorSubject<Role[]>([]);
  private readonly users$ = new BehaviorSubject<User[]>([]);
  private readonly selectedUser$ = new BehaviorSubject<User>(undefined);

  readonly roles = this.roles$.asObservable();
  readonly users = this.users$.asObservable();
  readonly selectedUser = this.selectedUser$.asObservable();

  get usersSnapshot() {
    return this.users$.value;
  }
  get currentUserSnapshot() {
    return this.selectedUser$.value;
  }
  get rolesSnapshot() {
    return this.roles$.value;
  }

  constructor(
    private apiClient: SecurityApiClient,
    private loadingWrapper: LoadingWrapperService,
    private dialog: DialogService
  ) {}

  loadData() {
    const call$ = this.loadingWrapper.wrap(forkJoin([this.apiClient.loadUsers(), this.apiClient.loadRoles()]));
    call$.subscribe(([users, roles]) => {
      const tmp = users.sort((a, b) => a.userName.localeCompare(b.userName));
      this.users$.next(tmp);
      this.selectedUser$.next(undefined);

      this.roles$.next(roles.sort((a, b) => a.description.localeCompare(b.description)));
    });
  }

  saveRoles(roles: Role[]) {
    const call$ = this.loadingWrapper.wrap(this.apiClient.saveRoles(roles));
    call$.subscribe(
      (_) => {
        this.dialog.snackSuccess('User roles saved!');
        this.roles$.next(roles);
      },
      (error) => {
        console.error(error);
        this.dialog.snackError(`Saving of user roles failed!\n${error.error.data}`);
      }
    );
  }

  selectUser(userName: string) {
    const user = this.users$.value.find((u) => u.userName === userName);
    this.selectedUser$.next({ ...user });
  }

  newUser() {
    const userName = `user.${this.users$.value.length + 1}`;
    const user: User = {
      userName: userName,
      displayName: userName,
      email: '',
      roles: '',
      isNew: true,
    };
    this.selectedUser$.next(user);
  }

  discardNewUser() {
    this.selectedUser$.next(undefined);
  }

  deleteUser(name: string) {
    this.apiClient.deleteUser(name).subscribe((r) => {
      if (r) {
        const temp = this.users$.value
          .filter((u) => u.userName !== name)
          .sort((a, b) => a.userName.localeCompare(b.userName));
        this.users$.next(temp);
        this.selectedUser$.next(undefined);
      }
    });
  }

  saveUser(originalName: string, user: User) {
    const call$ = this.loadingWrapper.wrap(this.apiClient.saveUser(user));
    call$.subscribe(
      (_) => {
        this.dialog.snackSuccess('User details saved!');
        user.changedPassword = '';
        user.isNew = false;
        const temp = this.usersSnapshot.filter((u) => u.userName !== originalName);
        const newUserArray = [...temp, user].sort((a, b) => a.userName.localeCompare(b.userName));
        this.users$.next(newUserArray);
        this.selectedUser$.next(user);
      },
      (error) => {
        console.error(error);
        this.dialog.snackError(`Saving of user data failed!\n${error.message}`);
      }
    );
  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));
}
