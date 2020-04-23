import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsApiClient } from '@features/settings/services/settings.api-client';
import { SettingsStore } from '@features/settings/services/settings.store';
import { SettingsComponent } from '@features/settings/settings.component';
import { SmtpEditorComponent } from '@features/settings/smtp-editor/smtp-editor.component';
import { SmtpListComponent } from '@features/settings/smtp-list/smtp-list.component';
import { SharedModule } from '@shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { ContentListComponent } from './content-list/content-list.component';
import { ContentEditorComponent } from './content-editor/content-editor.component';
import { ContentApiClient } from '@features/settings/services/content.api-client';
import { ContentStore } from '@features/settings/services/content.store';


@NgModule({
  declarations: [
    SettingsComponent,
    SmtpEditorComponent,
    SmtpListComponent,
    ContentListComponent,
    ContentEditorComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ],
  providers: [
    SettingsStore,
    SettingsApiClient,
    ContentStore,
    ContentApiClient
  ]
})
export class SettingsModule { }
