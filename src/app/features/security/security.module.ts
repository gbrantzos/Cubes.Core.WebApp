import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SecurityApiClient } from '@features/security/services/security.api-client';
import { SecurityStore } from '@features/security/services/security.store';
import { UserEditorComponent } from '@features/security/user-editor/user-editor.component';
import { UserListComponent } from '@features/security/user-list/user-list.component';
import { SharedModule } from '@shared/shared.module';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { UserPasswordComponent } from './user-password/user-password.component';

@NgModule({
  declarations: [SecurityComponent, UserListComponent, UserEditorComponent, UserPasswordComponent],
  imports: [CommonModule, SharedModule, SecurityRoutingModule],
  providers: [SecurityStore, SecurityApiClient],
  entryComponents: [UserPasswordComponent]
})
export class SecurityModule {}
