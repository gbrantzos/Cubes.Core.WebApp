import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedulerJob } from 'src/app/core/services/scheduler.service';

@Component({
  selector: 'cubes-job-row',
  templateUrl: './job-row.component.html',
  styleUrls: ['./job-row.component.scss']
})
export class JobRowComponent implements OnInit {
  @Input() job: SchedulerJob | null;

  @Output() editJob: EventEmitter<SchedulerJob | string> = new EventEmitter();
  @Output() runJob: EventEmitter<SchedulerJob> = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  onRunJob(job: SchedulerJob) {
    this.runJob.emit(job);
  }
  onEditJob(job: SchedulerJob | string) {
    this.editJob.emit(job);
  }

}
