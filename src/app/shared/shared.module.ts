import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WipComponent } from './components/wip/wip.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    WipComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
