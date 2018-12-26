import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobListComponent } from './components/job-list/job-list.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SchedulerComponent,
    JobListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SchedulerRoutingModule
  ]
})
export class SchedulerModule { }
