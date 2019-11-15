import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRoutingModule } from './data-access-routing.module';
import {
  DataAccessComponent,
  DialogOverviewExampleDialogComponent,
  FilePreviewOverlayComponent
} from './components/data-access/data-access.component';
import { SharedModule } from '../shared/shared.module';
import { ConnectionComponent } from './components/connection/connection.component';

@NgModule({
  declarations: [
    DataAccessComponent,
    DialogOverviewExampleDialogComponent,
    FilePreviewOverlayComponent,
    ConnectionComponent
  ],
  imports: [
    CommonModule,
    DataAccessRoutingModule,
    SharedModule
  ],
  entryComponents: [
    DialogOverviewExampleDialogComponent,
    FilePreviewOverlayComponent
  ]
})
export class DataAccessModule { }
