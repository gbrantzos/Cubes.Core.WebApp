import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsStore, SmtpProfile } from '@features/settings/services/settings.store';
import { SmtpEditorComponent } from '@features/settings/smtp-editor/smtp-editor.component';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('editor') editor: SmtpEditorComponent;

  constructor(
    private store: SettingsStore,
    private dialogService: DialogService
  ) { }
  ngOnInit(): void { this.store.loadData(); }

  async reload() {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected profile.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.loadData();
  }

  async newProfile() {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new profile.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.newProfile();
  }

  async profileSelected(smtp: SmtpProfile) {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected profile.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.selectProfile(smtp.name);
  }
}
