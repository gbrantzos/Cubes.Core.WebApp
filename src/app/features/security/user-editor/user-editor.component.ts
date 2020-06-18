import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@features/security/services/security.model';
import { SecurityStore } from '@features/security/services/security.store';
import { UserPasswordComponent } from '@features/security/user-password/user-password.component';
import { DialogService } from '@shared/services/dialog.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditorComponent implements OnInit {
  public user$: Observable<User>;
  public form: FormGroup;
  public isNew = false;
  private originalName: string;
  constructor(
    private store: SecurityStore,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.selectedUser.pipe(
      map((user) => {
        this.originalName = user?.userName;
        this.isNew = user?.isNew ?? false;
        if (user) {
          this.form.patchValue(user);
        }
        return user;
      })
    );
    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._]*')]],
      displayName: ['', Validators.required],
      roles: [''],
      changedPassword: [''],
    });
  }

  pendingChanges(): boolean {
    return this.form.touched && this.form.dirty;
  }

  onDelete() {
    if (this.isNew) {
      this.dialogService.confirm('Discard new user?').subscribe((r) => {
        if (r) {
          this.store.discardNewUser();
        }
      });
    } else {
      this.dialogService.confirm('Delete current user?').subscribe((r) => {
        if (r) {
          this.store.deleteUser(this.originalName);
        }
      });
    }
  }

  async onSave() {
    const user = this.userFromEditor();
    const existing = this.store.usersSnapshot.find((s) => s.userName === user.userName);
    const willOverwrite = this.isNew ? existing : existing && existing.userName !== this.originalName;
    if (willOverwrite) {
      const dialogResult = await this.dialogService
        .confirm(`User with name '${user.userName}' already exist.\nContinue and overwrite?`)
        .toPromise();
      if (!dialogResult) {
        return;
      }
      this.originalName = user.userName;
    }
    this.store.saveUser(this.originalName, user);
    this.form.markAsPristine();
    this.isNew = false;
  }

  onSetPassword() {
    this.matDialog
      .open(UserPasswordComponent, {
        minWidth: '360px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          user: this.store.currentUserSnapshot.displayName,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        this.form.get('changedPassword').setValue(result);
        this.form.get('changedPassword').markAsDirty();
        this.form.markAsTouched();
      });
  }

  private userFromEditor(): User {
    const currentValue: any = this.form.getRawValue();
    const user = {
      userName: currentValue.userName,
      displayName: currentValue.displayName,
      roles: currentValue.roles || '',
      changedPassword: currentValue.changedPassword,
      isNew: false,
    } as User;

    return user;
  }
}
