import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettingsService } from './app-settings.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AppSettingsService
  ]
})
export class SharedModule { }
