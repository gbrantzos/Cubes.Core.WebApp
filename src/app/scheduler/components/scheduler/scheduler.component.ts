import { Component, OnInit, HostBinding } from '@angular/core';
import { catchError, delay, map } from 'rxjs/operators';
import { empty, forkJoin, Observable } from 'rxjs';

import { SchedulerService, SchedulerJob } from 'src/app/core/services/scheduler.service';
import { LookupService } from '@src/app/shared/services/lookup.service';
import { JobModifyEvent } from '../job-list/job-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  @HostBinding('class') class = 'base-component';

  public data$: any;
  public unloadedModifications: boolean;
  public errorLoading = false;
  public errorMessage = '';
  public autoReload = false;

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
    this.resetError();
    this.data$ = forkJoin(
      this.schedulerService.getSchedulerStatus(),
      this.lookupService.getLookup('jobTypes'),
      this.lookupService.getLookup('requestTypes')
    ).pipe(
      // delay(200),
      map(([schedulerStatus, jobTypes, requestTypes]) => {
        this.unloadedModifications = false;
        return {
          schedulerStatus,
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
    const jobAction: Observable<string> = event.jobId ?
    this.schedulerService.deleteSchedulerJob(event.jobId) :
    this.schedulerService.saveSchedulerJob(event.job);

    jobAction.subscribe(res => {
      this.displayMessage(res);
      this.unloadedModifications = true;
      this.autoReload = event.autoReload;
      if (event.autoReload) {
        this.reload();
      }
    }, err => {
      console.log(err);
      this.displayMessage(err);
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
