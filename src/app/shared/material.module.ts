import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material stuff
import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatTooltipModule,
  MatCardModule,
  MatMenuModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    // Material modules
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
