import { Component, OnInit } from '@angular/core';
import { catchError, delay } from 'rxjs/operators';
import { empty } from 'rxjs';
import { SchedulerService } from 'src/app/core/services/scheduler.service';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public schedulerStatus$;

  constructor(private schedulerService: SchedulerService) { }
  ngOnInit() { this.refresh(); }

  refresh() {
    this.schedulerStatus$ = this
      .schedulerService
      .getSchedulerStatus()
      .pipe(
        delay(2000), // Emulate some traffic...
        catchError((err, caught) => {
          // TODO: Add proper error handling and display!
          alert(err.message);
          console.error(err);
          return empty();
        })
      );
  }

  onJobListEvent(event: string) {
    if (event === 'refresh') {
      this.refresh();
    }
  }
}
