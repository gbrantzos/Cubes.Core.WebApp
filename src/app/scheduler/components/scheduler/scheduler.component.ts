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
  public errorLoading = false;
  public errorMessage = '';
  public autoReload = false;

  constructor(
    private schedulerService: SchedulerService,
    private lookupService: LookupService) { }
  ngOnInit() { this.refreshList(); }

  private resetError() {
    this.errorLoading = false;
    this.errorMessage = '';
  }

  refreshList() {
    this.resetError();

    this.data$ = forkJoin(
      this.schedulerService.getSchedulerStatus(),
      this.lookupService.getLookup('jobTypes'),
      this.lookupService.getLookup('commandTypes')
    ).pipe(
      delay(200),
      catchError((err, caught) => {
        // TODO: Add proper error handling and display!
        this.errorLoading = true;
        this.errorMessage = err.message;
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

  reload() { this.onSchedulerControl('reload'); }

  onSchedulerControl(event: string) {
    if (event === 'refresh') {
      this.refreshList();
    } else {
      this.schedulerService
        .schedulerCommand(event)
        .subscribe(res => {
          // TODO: Inform user
          console.log(res);
          this.refreshList();
        });
    }
  }

  onJobModify(event: JobModifyEvent) {
    this.schedulerService.saveSchedulerJob(event.job).subscribe(res => console.log(res));
    this.unloadedModifications = true;
    this.autoReload = event.autoReload;
    if (event.autoReload) {
      this.refreshList();
    }
  }
  onJobRun(event: SchedulerJob) {
    console.log(event);
  }
}
