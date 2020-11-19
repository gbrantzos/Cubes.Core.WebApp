import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role, User } from '@features/security/services/security.model';
import { SecurityStore } from '@features/security/services/security.store';
import { UserPasswordComponent } from '@features/security/user-password/user-password.component';
import { DialogService } from '@shared/services/dialog.service';
import { Observable } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

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
  public roles = [];
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
          const userRoles = user.roles?.split(',').map(t => t.trim());
          this.roles = this
            .store
            .rolesSnapshot.map(r => {
              return {
                'code': r.code,
                'description': r.description,
                'selected': userRoles.includes(r.code)
              };
            });
          this.form.patchValue(user);
        }
        return user;
      })
    );
    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    const form = this.formBuilder.group({
      userName: new FormControl('', {
        validators: [Validators.required, Validators.pattern('[a-zA-Z0-9._]*')],
        updateOn: 'blur',
      }),
      displayName: ['', Validators.required],
      email: ['', Validators.email],
      roles: [''],
      changedPassword: [''],
    });
    form
      .get('userName')
      .valueChanges.pipe(pairwise())
      .subscribe(([prev, next]) => {
        const display = form.get('displayName').value;
        if (display === prev) {
          form.get('displayName').setValue(next);
        }
      });

    return form;
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
          user: this.form.get('displayName').value,
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
    const selectedRoles = this.roles.filter(r => !!r.selected).map(r => r.code) ?? [];
    const user = {
      userName: currentValue.userName,
      displayName: currentValue.displayName,
      email: currentValue.email,
      roles: selectedRoles.join(','),
      changedPassword: currentValue.changedPassword,
      isNew: false,
    } as User;

    return user;
  }

  roleToggle(role) {
    role.selected = !role.selected;
  }
}
