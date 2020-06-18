import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { User } from '@features/security/services/security.model';
import { SecurityStore } from '@features/security/services/security.store';
import { UserEditorComponent } from '@features/security/user-editor/user-editor.component';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  @ViewChild('userEditor') userEditor: UserEditorComponent;
  public tabIndex = 0;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: SecurityStore,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    const view = this.route.snapshot.paramMap.get('view') ?? 'users';
    this.tabIndex = view === 'users' ? 0 : view === 'roles' ? 1 : 0;
    this.store.loadData();
  }

  async reload() {
    if (this.userEditor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected user.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.loadData();
  }

  tabChanged(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.location.replaceState('security/users');
        break;
      case 1:
        this.location.replaceState('security/roles');
        break;
      default:
        break;
    }
  }

  async userSelected(user: User) {
    if (this.userEditor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected user.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.selectUser(user.userName);
  }

  async newUser() {
    if (this.userEditor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected user.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.newUser();
  }
}
