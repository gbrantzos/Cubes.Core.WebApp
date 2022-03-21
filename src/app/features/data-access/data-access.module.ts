import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRoutingModule } from './data-access-routing.module';
import { SharedModule } from '@shared/shared.module';
import { DataAccessComponent } from '@features/data-access/data-access.component';
import { ConnectionListComponent } from './connection-list/connection-list.component';
import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';
import { DataAccessStore } from '@features/data-access/services/data-access.store';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { QueryListComponent } from './query-list/query-list.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { QueryExecutorComponent } from './query-executor/query-executor.component';
import { QueryExecutorParamsComponent } from './query-executor-params/query-executor-params.component';
import { DefaultQueriesComponent } from './default-queries/default-queries.component';

@NgModule({
    declarations: [
        DataAccessComponent,
        ConnectionListComponent,
        ConnectionEditorComponent,
        QueryListComponent,
        QueryEditorComponent,
        QueryExecutorComponent,
        QueryExecutorParamsComponent,
        DefaultQueriesComponent
    ],
    imports: [
        CommonModule,
        DataAccessRoutingModule,
        SharedModule
    ],
    providers: [
        DataAccessStore,
        DataAccessApiClient
    ]
})
export class DataAccessModule { }
