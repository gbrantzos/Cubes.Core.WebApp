import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRoutingModule } from './data-access-routing.module';
import { DataAccessComponent, DialogOverviewExampleDialogComponent } from './components/data-access/data-access.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [
    DataAccessComponent,
    DialogOverviewExampleDialogComponent
  ],
  imports: [
    CommonModule,
    DataAccessRoutingModule,
    MaterialModule
  ],
  entryComponents: [
    DialogOverviewExampleDialogComponent
  ]
})
export class DataAccessModule { }
