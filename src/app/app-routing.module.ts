import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './core/components/about/about.component';
import { WipComponent } from './shared/components/wip/wip.component';

const routes: Routes = [
  // Core, plus Work in progress...
  { path: 'about', component: AboutComponent },
  { path: 'data', component: WipComponent },
  { path: 'settings', component: WipComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
