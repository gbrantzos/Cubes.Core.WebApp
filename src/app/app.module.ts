import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { SharedModule } from './@shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { NavBarComponent } from '@core/components/nav-bar/nav-bar.component';
import { SideBarComponent } from '@core/components/side-bar/side-bar.component';
import { loadConfiguration } from '@core/load-configuration';
import { ConfigurationService } from '@core/services/configuration.service';
import { LoginComponent } from '@core/components/login/login.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { ApiResultWrapperInterceptor } from '@core/helpers/api-result-wrapper.interceptor';
import { LoaderInterceptorService } from '@shared/services/loader-interceptor.service';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MainLayoutComponent,
    NavBarComponent,
    SideBarComponent,
    LoginComponent,
    NotFoundComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      multi: true,
      deps: [
        HttpClient,
        ConfigurationService
      ]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiResultWrapperInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
