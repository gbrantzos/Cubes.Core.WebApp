import { Component, OnInit } from '@angular/core';
import { catchError, delay, map } from 'rxjs/operators';
import { empty, forkJoin } from 'rxjs';
import { SchedulerService, SchedulerJob } from 'src/app/core/services/scheduler.service';
import { LookupService } from 'src/app/core/services/lookup.service';
import { JobModifyEvent } from '../job-list/job-list.component';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public data$: any;
  public unloadedModifications: boolean;
  public autoReload = false;

  constructor(
    private schedulerService: SchedulerService,
    private lookupService: LookupService) { }
  ngOnInit() { this.loadData(); }

  loadData() {
    this.data$ = forkJoin(
      this.schedulerService.getSchedulerStatus(),
      this.lookupService.getLookup('jobTypes'),
      this.lookupService.getLookup('commandTypes')
    ).pipe(
      delay(2000),
      catchError((err, caught) => {
        // TODO: Add proper error handling and display!
        alert(err.message);
        console.error(err);
        return empty();
      }),
      map(([schedulerStatus, jobTypes, commandTypes]) => {
        this.unloadedModifications = false;
        return {
          schedulerStatus,
          lookups: {
            jobTypes,
            commandTypes
          }
        };
      })
    );
  }

  reload() {
    console.log('About to reload scheduler...');
    this.loadData();
  }

  onJobListEvent(event: string) {
    if (event === 'refresh') {
      this.loadData();
    }
  }

  onJobModify(event: JobModifyEvent) {
    console.log(event);
    this.unloadedModifications = true;
    this.autoReload = event.autoReload;
    if (event.autoReload) {
      this.loadData();
    }
  }
  onJobRun(event: SchedulerJob) {
    console.log(event);
  }
}
