import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobListComponent } from './components/job-list/job-list.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { JobRowComponent } from './components/job-row/job-row.component';
import { JobEditorComponent } from './components/job-editor/job-editor.component';
import { SharedModule } from '../shared/shared.module';
import { DefaultEditorComponent } from './components/execution-params-editors/default-editor/default-editor.component';
// tslint:disable-next-line:max-line-length
import { ExecuteCommandEditorComponent } from './components/execution-params-editors/execute-command-editor/execute-command-editor.component';

@NgModule({
  declarations: [
    SchedulerComponent,
    JobListComponent,
    JobRowComponent,
    JobEditorComponent,
    DefaultEditorComponent,
    ExecuteCommandEditorComponent
  ],
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    SharedModule
  ],
  entryComponents: [
    JobEditorComponent
  ]
})
export class SchedulerModule { }
