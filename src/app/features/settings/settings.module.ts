import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { SmtpSelectorComponent } from './components/smtp-selector/smtp-selector.component';
import { SettingsComponent } from '@features/settings/settings.component';
import { SmtpEditorComponent } from '@features/settings/smtp-editor/smtp-editor.component';
import { SmtpListComponent } from '@features/settings/smtp-list/smtp-list.component';
import { SettingsStore } from '@features/settings/services/settings.store';

@NgModule({
  declarations: [
    SettingsComponent,
    SmtpSelectorComponent,
    SmtpEditorComponent,
    SmtpListComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ],
  providers: [
    SettingsStore
  ]
})
export class SettingsModule { }
