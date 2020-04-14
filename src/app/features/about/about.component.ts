import { Component, OnInit, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'cubes-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public ngVersion = VERSION.full;
  public pingData$: any;
  public error;

  constructor(private http: HttpClient) { }

  ngOnInit(): void { this.pingServer(); }

  pingServer() {
    this.error = '';
    this.pingData$ = this
      .http
      .get('api/system/ping')
      .pipe(
        delay(1200),
        catchError(error => {
          console.error(error);
          this.error = error;
          return of();
        })
      );
  }
}
