import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
    this.pingData$ = this.http.get('/api/system/ping');
  }
}
