import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAccessComponent } from '@features/data-access/data-access.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'connections',
    pathMatch: 'full'
  },
  {
    path: ':view',
    component: DataAccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataAccessRoutingModule { }
