import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './core/components/about/about.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent,  data: { Title: ' ' } },
  { path: 'about', component: AboutComponent, data: { Title: 'About' } },
  { path: 'login', component: LoginComponent },

  // Lazy loading
  { path: 'scheduler', loadChildren: './scheduler/scheduler.module#SchedulerModule' },
  { path: 'data',      loadChildren: './data-access/data-access.module#DataAccessModule' },
  { path: 'scheduler', loadChildren: './scheduler/scheduler.module#SchedulerModule' },
  { path: 'settings',  loadChildren: './settings/settings.module#SettingsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
