import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material stuff
import {
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
  MatSlideToggleModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

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
    MatSlideToggleModule
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
    MatSlideToggleModule
  ]
})
export class MaterialModule { }
