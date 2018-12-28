import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { catchError, delay } from 'rxjs/operators';
import { empty, of } from 'rxjs';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public settings$;

  constructor(private appSettings: AppSettingsService) { }
  ngOnInit() {
    this.settings$ = this
      .appSettings
      .getSettings()
      .pipe(
        delay(4000),
        catchError((err, caught) => {
          alert(err.message);
          console.error(err);
          return of({ id: -1});
        })
      );
  }


}
