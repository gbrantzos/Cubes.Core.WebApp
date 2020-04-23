import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ContentStore } from '@features/settings/services/content.store';
import { SettingsStore, SmtpProfile } from '@features/settings/services/settings.store';
import { SmtpEditorComponent } from '@features/settings/smtp-editor/smtp-editor.component';
import { DialogService } from '@shared/services/dialog.service';
import { ContentEditorComponent } from '@features/settings/content-editor/content-editor.component';
import { StaticContent } from '@features/settings/services/content.model';

@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('editor') editor: SmtpEditorComponent;
  @ViewChild('contentEditor') contentEditor: ContentEditorComponent;
  public tabIndex = 0;

  constructor(
    private store: SettingsStore,
    private contentStore: ContentStore,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit(): void {
    const view = this.route.snapshot.paramMap.get('view') ?? 'smtp';
    this.tabIndex = view === 'smtp' ? 0 : view === 'content' ? 1 : 0;

    this.store.loadData();
    this.contentStore.loadData();
  }

  async reload() {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected profile.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    if (this.contentEditor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on static content editor.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.loadData();
    this.contentStore.loadData();
  }

  async newProfile() {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new profile.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.newProfile();
  }

  async profileSelected(smtp: SmtpProfile) {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected profile.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.selectProfile(smtp.name);
  }

  async contentSelected(content: StaticContent) {
    if (this.contentEditor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on static content editor.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.contentStore.selectContent(content.requestPath);
  }

  tabChanged(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.location.replaceState('settings/smtp');
        break;
      case 1:
        this.location.replaceState('settings/content');
        break;
      default:
        break;
    }
  }

  async newContent() {
    if (this.contentEditor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on static content editor.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.contentStore.newContent();
  }
}
