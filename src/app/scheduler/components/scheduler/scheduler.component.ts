import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from 'src/app/shared/app-settings.service';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public settings$;

  constructor(private appSettings: AppSettingsService) { }
  ngOnInit() {
    this.settings$ = this.appSettings.getSettings();
  }


}
