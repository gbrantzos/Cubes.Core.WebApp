import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { NavBarComponent } from '@core/components/nav-bar/nav-bar.component';
import { SideBarComponent } from '@core/components/side-bar/side-bar.component';
import { loadConfiguration } from '@core/helpers/load-configuration';
import { LoginComponent } from '@core/components/login/login.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';

import { ApiResultWrapperInterceptor } from '@core/helpers/api-result-wrapper.interceptor';
import { LoaderInterceptor } from '@core/helpers/loader.interceptor';

import { ConfigurationService } from '@core/services/configuration.service';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
      useClass: LoaderInterceptor,
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
