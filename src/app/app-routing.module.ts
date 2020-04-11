import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@core/components/login/login.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Lazy loaded modules
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children:
      [
        {
          path: 'home',
          loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
        },
        {
          path: 'scheduler',
          loadChildren: () => import('./features/scheduler/scheduler.module').then(m => m.SchedulerModule)
        },
        {
          path: 'data',
          loadChildren: () => import('./features/data-access/data-access.module').then(m => m.DataAccessModule)
        },
        {
          path: 'settings',
          loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
        }
      ]
  },

  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },

  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
