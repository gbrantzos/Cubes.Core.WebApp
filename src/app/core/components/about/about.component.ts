import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
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
  ngOnInit() { this.pingServer(); }

  pingServer() {
    this.pingData$ = this
      .http
      .get('/api/system/ping')
      .pipe(
        catchError(error => {
          console.error(error);
          this.error = error;
          return of();
        })
      );
  }
}
