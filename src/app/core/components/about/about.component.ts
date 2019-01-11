import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public ngVersion = VERSION.full;
  public pingData$: any;

  constructor(private http: HttpClient) { }
  ngOnInit() { this.pingServer(); }

  pingServer() {
    this.pingData$ = this.http
      .get('http://localhost:3001/api/core/ping')
      .pipe(
        map(res => (<any>res).result)
      );
  }
}
