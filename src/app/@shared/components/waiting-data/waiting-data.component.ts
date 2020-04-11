import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cubes-waiting-data',
  templateUrl: './waiting-data.component.html',
  styleUrls: ['./waiting-data.component.scss']
})
export class WaitingDataComponent implements OnInit {
  @Input() message = 'Waiting for data ...';
  @Input() hasErrors = false;
  @Input() errorMessage: string;

  @Output() retry = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  onRetry() { this.retry.emit(null); }
}
