import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DefaultEditorComponent } from '@features/scheduler/params-editors/default-editor/default-editor.component';
import { ExecuteRequestEditorComponent } from '@features/scheduler/params-editors/execute-request-editor/execute-request-editor.component';
import { JobDetails } from '@features/scheduler/pipes/job-details.pipe';
import { SchedulerRoutingModule } from '@features/scheduler/scheduler-routing.module';
import { SchedulerComponent } from '@features/scheduler/scheduler.component';
import { SchedulerApiClient } from '@features/scheduler/services/scheduler.api-client';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { SharedModule } from '@shared/shared.module';
import { JobEditorComponent } from './job-editor/job-editor.component';
import { JobListComponent } from './job-list/job-list.component';
import { CronHelpComponent } from '@features/scheduler/cron-help/cron-help.component';

@NgModule({
  declarations: [
    SchedulerComponent,
    JobListComponent,
    JobEditorComponent,
    JobDetails,
    ExecuteRequestEditorComponent,
    DefaultEditorComponent,
  ],
  imports: [CommonModule, SchedulerRoutingModule, SharedModule],
  providers: [SchedulerStore, SchedulerApiClient],
  entryComponents: [CronHelpComponent]
})
export class SchedulerModule {}
