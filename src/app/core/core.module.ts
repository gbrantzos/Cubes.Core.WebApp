import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material stuff
import {
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { AppSettingsService } from './services/app-settings.service';
import { HttpClientModule } from '@angular/common/http';

import { MainNavComponent } from './components/main-nav/main-nav.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    HttpClientModule,

    // Material modules
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
  ],
  providers: [
    AppSettingsService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
