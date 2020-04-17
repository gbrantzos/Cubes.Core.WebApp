import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialExports } from '@shared/modules/materialExports';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...materialExports
  ],
  exports: [
    ...materialExports
  ]
})
export class MaterialModule { }
