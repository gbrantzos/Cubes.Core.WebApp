import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';

@Component({
  selector: 'cubes-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Input() jobs: SchedulerJob[] | null;
  @Input() started: boolean;

  @Output() menuClick = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  menuClicked(menuItem: string) {
    this.menuClick.emit(menuItem);
  }
}
