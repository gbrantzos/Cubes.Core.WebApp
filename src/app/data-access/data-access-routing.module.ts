import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAccessComponent } from './components/data-access/data-access.component';

const routes: Routes = [
  { path: 'data', component: DataAccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataAccessRoutingModule { }
