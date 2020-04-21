import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@core/components/login/login.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Lazy loaded modules
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'scheduler',
        loadChildren: () =>
          import('./features/scheduler/scheduler.module').then(
            (m) => m.SchedulerModule
          ),
      },
      {
        path: 'data',
        loadChildren: () =>
          import('./features/data-access/data-access.module').then(
            (m) => m.DataAccessModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./features/about/about.module').then((m) => m.AboutModule),
      },
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },

  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
