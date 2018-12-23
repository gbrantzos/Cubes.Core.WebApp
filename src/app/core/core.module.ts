import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from './main-nav/main-nav.component';

// Material stuff
import {
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';
import { AboutComponent } from './about/about.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  declarations: [
    MainNavComponent,
    AboutComponent
  ],
  exports: [
    // Material stuff
    MatButtonModule,

    // Module components
    MainNavComponent
  ]
})
export class CoreModule { }
