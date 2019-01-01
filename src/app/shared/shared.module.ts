import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WipComponent } from './components/wip/wip.component';
import { MaterialModule } from './material.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { DialogService } from './services/dialog.service';

@NgModule({
  declarations: [
    WipComponent,
    AlertDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    AlertDialogComponent
  ],
  providers: [
    DialogService
  ]
})
export class SharedModule { }
