import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingComponent
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
