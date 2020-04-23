import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from '@features/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'smtp',
    pathMatch: 'full',
  },
  {
    path: ':view',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
