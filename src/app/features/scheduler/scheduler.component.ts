import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { SchedulerStatus, SchedulerJob } from '@features/scheduler/services/scheduler.models';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public status$: Observable<SchedulerStatus>;
  constructor(private store: SchedulerStore) { }

  ngOnInit(): void {
    this.store.loadData();
    this.status$ = this.store.schedulerStatus;
  }

  reload() { this.store.loadData(); }
  toggleScheduler(currentState) { console.log(currentState); }

  jobSelected(job: SchedulerJob) {
    this.store.selectJob(job.name);
  }

  newJob() {
    console.log('New job requested');
  }
}
