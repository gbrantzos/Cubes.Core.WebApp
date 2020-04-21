import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsApiClient } from '@features/settings/services/settings.api-client';
import { SettingsStore } from '@features/settings/services/settings.store';
import { SettingsComponent } from '@features/settings/settings.component';
import { SmtpEditorComponent } from '@features/settings/smtp-editor/smtp-editor.component';
import { SmtpListComponent } from '@features/settings/smtp-list/smtp-list.component';
import { SharedModule } from '@shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';


@NgModule({
  declarations: [
    SettingsComponent,
    SmtpEditorComponent,
    SmtpListComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ],
  providers: [
    SettingsStore,
    SettingsApiClient
  ]
})
export class SettingsModule { }
