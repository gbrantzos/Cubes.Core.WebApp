import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './core/about/about.component';

const routes: Routes = [
  // Core
  { path: 'about', component: AboutComponent },

  // Scheduler
  { path: 'schedulerModule', loadChildren: './scheduler/scheduler.module#SchedulerModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
