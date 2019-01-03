import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobListComponent } from './components/job-list/job-list.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { MaterialModule } from '../shared/material.module';
import { JobRowComponent } from './components/job-row/job-row.component';
import { JobEditorComponent } from './components/job-editor/job-editor.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SchedulerComponent,
    JobListComponent,
    JobRowComponent,
    JobEditorComponent
  ],
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    SharedModule,
    MaterialModule
  ],
  entryComponents: [
    JobEditorComponent
  ]
})
export class SchedulerModule { }
