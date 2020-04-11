import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './components/settings/settings.component';
import { SmtpSelectorComponent } from './components/smtp-selector/smtp-selector.component';
import { SmtpEditorComponent } from './components/smtp-editor/smtp-editor.component';

@NgModule({
  declarations: [SettingsComponent, SmtpSelectorComponent, SmtpEditorComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
