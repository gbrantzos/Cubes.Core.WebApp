import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { AppSettingsService } from './services/app-settings.service';
import { HttpClientModule } from '@angular/common/http';

import { AboutComponent } from './components/about/about.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    AboutComponent
  ],
  exports: [
    // Module components
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
