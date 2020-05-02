import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApplicationOptionsComponent } from '@features/settings/application-options/application-options.component';
import { ApplicationOptionsService } from '@features/settings/services/application-options.service';
import { ContentApiClient } from '@features/settings/services/content.api-client';
import { ContentStore } from '@features/settings/services/content.store';
import { SettingsApiClient } from '@features/settings/services/settings.api-client';
import { SettingsStore } from '@features/settings/services/settings.store';
import { SettingsComponent } from '@features/settings/settings.component';
import { SmtpEditorComponent } from '@features/settings/smtp-editor/smtp-editor.component';
import { SmtpListComponent } from '@features/settings/smtp-list/smtp-list.component';
import { SharedModule } from '@shared/shared.module';
import { ContentEditorComponent } from './content-editor/content-editor.component';
import { ContentListComponent } from './content-list/content-list.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    SettingsComponent,
    SmtpEditorComponent,
    SmtpListComponent,
    ContentListComponent,
    ContentEditorComponent,
    ApplicationOptionsComponent,
  ],
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
  providers: [SettingsStore, SettingsApiClient, ContentStore, ContentApiClient, ApplicationOptionsService],
})
export class SettingsModule {}
