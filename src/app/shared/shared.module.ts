import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    LoadingComponent,
    DynamicFormComponent,
    LoaderComponent
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
    LoadingComponent,
    DynamicFormComponent,
    LoaderComponent
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
