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
  { path: 'scheduler', loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule) },
  { path: 'data',      loadChildren: () => import('./data-access/data-access.module').then(m => m.DataAccessModule) },
  { path: 'scheduler', loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule) },
  { path: 'settings',  loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
