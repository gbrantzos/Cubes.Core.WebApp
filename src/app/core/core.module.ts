import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { AppSettingsService } from './services/app-settings.service';
import { HttpClientModule } from '@angular/common/http';

import { MainNavComponent } from './components/main-nav/main-nav.component';
import { AboutComponent } from './components/about/about.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    HttpClientModule,
    MaterialModule
  ],
  declarations: [
    MainNavComponent,
    AboutComponent
  ],
  exports: [
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
