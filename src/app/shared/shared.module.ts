import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WipComponent } from './components/wip/wip.component';
import { MaterialModule } from './material.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { DialogService } from './services/dialog.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    WipComponent,
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [
    DialogService
  ]
})
export class SharedModule { }
