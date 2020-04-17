import { Component, OnInit, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { format } from 'date-fns';
import { GitVersion } from 'src/environments/versions';
import { ConfigurationService } from '@core/services/configuration.service';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public ngVersion = VERSION.full;
  public pingData$: any;
  public error: any;
  public gitVersion = GitVersion;
  private baseUrl: string;

  constructor(private http: HttpClient, config: ConfigurationService) { this.baseUrl = config.apiUrl; }

  ngOnInit(): void { this.pingServer(); }

  pingServer() {
    this.error = '';
    this.pingData$ = this
      .http
      .get(`${this.baseUrl}/system/ping`)
      .pipe(
        delay(1200),
        catchError(error => {
          console.error(error);
          this.error = error;
          return of();
        })
      );
  }

  saveDetails(details: any, source: 'ping-info' | 'error-details') {
    const dateStr = format(new Date(), 'yyyyMMddHHmm');
    const fileName = `${source}.${dateStr}.json`;
    const content = JSON.stringify(details, null, 2);
    const a = document.createElement('a');

    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(content));
    a.setAttribute('download', fileName);
    document.body.appendChild(a); // Required for FF

    a.click();
    document.body.removeChild(a);
  }
}
