import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRoutingModule } from './data-access-routing.module';
import { DataAccessComponent } from './components/data-access/data-access.component';
import { SharedModule } from '../shared/shared.module';
import { ConnectionComponent } from './components/connection/connection.component';
import { QueryComponent } from './components/query/query.component';
import { ExecuteQueryComponent } from './components/execute-query/execute-query.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';

@NgModule({
  declarations: [
    DataAccessComponent,
    ConnectionComponent,
    QueryComponent,
    ExecuteQueryComponent,
    ExportSettingsComponent
  ],
  imports: [
    CommonModule,
    DataAccessRoutingModule,
    SharedModule
  ],
  entryComponents: [
    ExecuteQueryComponent,
    ExportSettingsComponent
  ]
})
export class DataAccessModule { }
