import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRoutingModule } from './data-access-routing.module';
import { DataAccessComponent } from './components/data-access/data-access.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [DataAccessComponent],
  imports: [
    CommonModule,
    DataAccessRoutingModule,
    MaterialModule
  ]
})
export class DataAccessModule { }
