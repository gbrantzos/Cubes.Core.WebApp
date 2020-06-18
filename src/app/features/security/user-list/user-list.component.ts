import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { User } from '@features/security/services/security.model';
import { SecurityStore } from '@features/security/services/security.store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnDestroy {
  @Output() userSelected = new EventEmitter<User>();
  @Output() newUser = new EventEmitter<void>();
  public users$: Observable<User[]>;
  public selectedUser = '';
  private subs = new SubSink();

  constructor(private store: SecurityStore, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.users$ = this.store.users;
    this.subs.sink = this.store.selectedUser.subscribe((user) => {
      this.selectedUser = user?.userName ?? '';
      this.changeDetectorRef.detectChanges();
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectUser(user: User) {
    this.userSelected.emit(user);
  }
  onNew() {
    this.newUser.emit();
  }
}
