import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobListComponent } from './components/job-list/job-list.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { MaterialModule } from '../shared/material.module';
import { JobRowComponent } from './components/job-row/job-row.component';

@NgModule({
  declarations: [
    SchedulerComponent,
    JobListComponent,
    JobRowComponent
  ],
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    MaterialModule
  ]
})
export class SchedulerModule { }
