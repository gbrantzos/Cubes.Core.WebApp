import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRoutingModule } from './data-access-routing.module';
import { ExecuteQueryComponent } from './components/execute-query/execute-query.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { SharedModule } from '@shared/shared.module';
import { DataAccessComponent } from '@features/data-access/data-access.component';
import { ConnectionListComponent } from './connection-list/connection-list.component';
import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';
import { DataAccessStore } from '@features/data-access/services/data-access.store';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { QueryListComponent } from './query-list/query-list.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { QueryExecutorComponent } from './query-executor/query-executor.component';

@NgModule({
  declarations: [
    DataAccessComponent,
    ExecuteQueryComponent,
    ExportSettingsComponent,
    ConnectionListComponent,
    ConnectionEditorComponent,
    QueryListComponent,
    QueryEditorComponent,
    QueryExecutorComponent
  ],
  imports: [
    CommonModule,
    DataAccessRoutingModule,
    SharedModule
  ],
  entryComponents: [
    QueryExecutorComponent,
    ExportSettingsComponent
  ],
  providers: [
    DataAccessStore,
    DataAccessApiClient
  ]
})
export class DataAccessModule { }
