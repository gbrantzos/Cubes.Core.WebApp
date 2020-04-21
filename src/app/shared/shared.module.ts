import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertDialogComponent } from '@shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DynamicTableComponent } from '@shared/components/dynamic-table/dynamic-table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MaterialModule } from '@shared/modules/material.module';
import { LookupService } from '@shared/services/lookup.service';
import { SchemaService } from '@shared/services/schema.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    DynamicFormComponent,
    DynamicTableComponent,
    PageHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,

    NgxSpinnerModule,
    NgxJsonViewerModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxJsonViewerModule,
    NgxSpinnerModule,

    DynamicFormComponent,
    DynamicTableComponent,
    PageHeaderComponent,
  ],
  entryComponents: [AlertDialogComponent, ConfirmDialogComponent],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      // The following service have some kind of state so they better be provided once!
      providers: [LookupService, SchemaService],
    };
  }
}
