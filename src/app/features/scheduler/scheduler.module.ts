import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { SchedulerRoutingModule } from '@features/scheduler/scheduler-routing.module';
import { SchedulerComponent } from '@features/scheduler/scheduler.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobEditorComponent } from './job-editor/job-editor.component';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { JobDetails } from '@features/scheduler/pipes/job-details.pipe';
import { ExecuteRequestEditorComponent } from '@features/scheduler/params-editors/execute-request-editor/execute-request-editor.component';
import { DefaultEditorComponent } from '@features/scheduler/params-editors/default-editor/default-editor.component';

@NgModule({
  declarations: [
    SchedulerComponent,
    JobListComponent,
    JobEditorComponent,
    JobDetails,
    ExecuteRequestEditorComponent,
    DefaultEditorComponent
  ],
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    SharedModule
  ],
  providers: [
    SchedulerStore,
    SchedulerApiClient
  ]
})
export class SchedulerModule { }
