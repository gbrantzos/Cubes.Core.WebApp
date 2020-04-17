import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { NavBarComponent } from '@core/components/nav-bar/nav-bar.component';
import { SideNavComponent } from '@core/components/side-nav/side-nav.component';
import { loadConfiguration } from '@core/helpers/load-configuration';
import { LoginComponent } from '@core/components/login/login.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';

import { ConfigurationService } from '@core/services/configuration.service';

import { CubesApiResultInterceptor } from '@core/helpers/cubes-api-result.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MainLayoutComponent,
    NavBarComponent,
    SideNavComponent,
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
      useClass: CubesApiResultInterceptor,
      multi: true
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue:  {
        duration: 5000,
        panelClass: 'snack-bar',
        horizontalPosition: 'right'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
