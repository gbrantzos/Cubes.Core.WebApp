import { Injectable } from '@angular/core';
import { SecurityApiClient } from '@features/security/services/security.api-client';
import { User } from '@features/security/services/security.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SecurityStore {
  private readonly users$ = new BehaviorSubject<User[]>([]);
  private readonly selectedUser$ = new BehaviorSubject<User>(undefined);

  readonly users = this.users$.asObservable();
  readonly selectedUser = this.selectedUser$.asObservable();

  get usersSnapshot() {
    return this.users$.value;
  }
  get currentUserSnapshot() {
    return this.selectedUser$.value;
  }

  constructor(
    private apiClient: SecurityApiClient,
    private loadingWrapper: LoadingWrapperService,
    private dialog: DialogService
  ) {}

  loadData() {
    const call$ = this.loadingWrapper.wrap(this.apiClient.loadUsers());
    call$.subscribe((data) => {
      this.users$.next(data);
      this.selectedUser$.next(undefined);
    });
  }

  saveData() {
    const call$ = this.loadingWrapper.wrap(this.apiClient.saveUser(this.selectedUser$.value));
    call$.subscribe((_) => this.dialog.snackSuccess('User details saved!')); /* and roles */
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
    const temp = this.usersSnapshot.filter((u) => u.userName !== originalName);
    const newUserArray = [...temp, user].sort((a, b) => a.userName.localeCompare(b.userName));
    this.users$.next(newUserArray);

    const usr = this.clone(user) as User;
    usr.isNew = false;
    this.selectedUser$.next(usr);
    this.saveData();

  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));
}
