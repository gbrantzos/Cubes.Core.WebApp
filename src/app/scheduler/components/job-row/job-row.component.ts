import { Component, OnInit, Input } from '@angular/core';
import { SchedulerJob } from 'src/app/core/services/sceduler.service';

@Component({
  selector: 'cubes-job-row',
  templateUrl: './job-row.component.html',
  styleUrls: ['./job-row.component.scss']
})
export class JobRowComponent implements OnInit {
  @Input() job: SchedulerJob | null;
  constructor() { }

  ngOnInit() {
  }

}
