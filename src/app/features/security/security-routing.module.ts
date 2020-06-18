import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityComponent } from '@features/security/security.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: ':view',
    component: SecurityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
