import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cubes-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() message = 'Waiting for data ...';
  @Input() hasErrors = false;
  @Input() errorMessage: string;

  @Output() retry = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  onRetry() { this.retry.emit(null); }
}
