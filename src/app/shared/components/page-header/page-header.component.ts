import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cubes-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  @Output() reload = new EventEmitter<void>();

  constructor() { }
  ngOnInit(): void {  }

  onReload = () => this.reload.emit();
}
