import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material stuff
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Data change support must be on root module!
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  NativeDateAdapter,
  MatNativeDateModule
} from '@angular/material';
import { CustomDateAdapter } from '../@helpers/custom-date-adapter';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatNativeDateModule,

    // Material modules
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDatepickerModule
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDatepickerModule
  ],
  providers: [
    // TODO Do we need this??
    // { provide: MAT_DATE_LOCALE, useValue: 'el-EL', multi: true },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class MaterialModule { }
