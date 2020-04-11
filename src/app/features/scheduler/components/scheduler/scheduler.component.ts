import { Component, OnInit, HostBinding } from '@angular/core';
import { catchError, delay, map } from 'rxjs/operators';
import { empty, forkJoin, Observable } from 'rxjs';

import { SchedulerService, SchedulerJob } from 'src/app/core/services/scheduler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LookupService } from '@shared/services/lookup.service';
import { JobModifyEvent } from '@features/scheduler/components/job-list/job-list.component';


@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  @HostBinding('class') class = 'base-component';

  public data$: any;
  public errorLoading = false;
  public errorMessage = '';

  private jobs: SchedulerJob[];

  constructor(
    private schedulerService: SchedulerService,
    private lookupService: LookupService,
    private snackBar: MatSnackBar) { }
  ngOnInit() { this.refreshList(); }

  private resetError() {
    this.errorLoading = false;
    this.errorMessage = '';
  }

  refreshList() {
    this.jobs = [];
    this.resetError();
    this.data$ = forkJoin(
      this.schedulerService.getSchedulerStatus(),
      this.lookupService.getLookup('jobTypes'),
      this.lookupService.getLookup('requestTypes')
    ).pipe(
      // delay(200),
      map(([schedulerStatus, jobTypes, requestTypes]) => {
        this.jobs = schedulerStatus.jobs;
        return {
          schedulerStatus: schedulerStatus,
          lookups: {
            jobTypes,
            requestTypes
          }
        };
      }),
      catchError((err, caught) => {
        this.errorLoading = true;
        this.errorMessage = err.message;

        this.displayMessage(this.errorMessage);
        console.error(err);
        return empty();
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
          this.displayMessage(res);
          this.refreshList();
        });
    }
  }

  onJobModify(event: JobModifyEvent) {
    const toSave = event.jobId ?
      this.jobs.filter(j => j.id !== event.jobId) :
      event.initialName ?
        this.jobs :
        [
          ...this.jobs.filter(j => j.description !== event.job.description),
          event.job
        ];

    this.schedulerService
      .saveSchedulerJobs(toSave)
      .subscribe(res => {
        // Add a delay to wait Cubes Scheduler to reload
        setTimeout(() => this.refreshList(), 3000);
      }, err => {
        console.log(err);
        this.displayMessage(err.message);
      });
  }

  onJobRun(event: SchedulerJob) {
    this.schedulerService
      .runSchedulerJob(event.description)
      .subscribe(msg => this.displayMessage(msg));
  }

  private displayMessage(message: string) {
    const snackRef = this.snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
