import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
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
import { DynamicListEditorComponent } from './components/dynamic-list-editor/dynamic-list-editor.component';
import { DynamicListComponent } from './components/dynamic-list/dynamic-list.component';
import { ListItemExpressionPipe } from './pipes/list-item-expression.pipe';

@NgModule({
    declarations: [
        AlertDialogComponent,
        ConfirmDialogComponent,
        DynamicFormComponent,
        DynamicTableComponent,
        PageHeaderComponent,
        DynamicListComponent,
        DynamicListEditorComponent,
        ListItemExpressionPipe,
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
        DynamicListComponent,
        PageHeaderComponent,
    ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        // The following service have some kind of state so they better be provided once!
        LookupService,
        SchemaService,

        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            duration: 5000,
            panelClass: 'snack-bar',
            horizontalPosition: 'right',
          },
        },
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: {
            hasBackdrop: true,
            backdropClass: 'dialog-backdrop'
          },
        },
      ],
    };
  }
}
