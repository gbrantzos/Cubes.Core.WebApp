import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { JobListComponent } from './job-list/job-list.component';

const routes: Routes = [
  { path: 'scheduler', component: JobListComponent }
];

@NgModule({
  declarations: [JobListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SchedulerModule { }
