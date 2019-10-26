import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivationEnd } from '@angular/router';
import { map, filter, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cubes-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  public title = '';
  private onDebug = false; // Enable this for debugging!
  @ViewChild('drawer', { static: true }) public sidenav: MatSidenav;

  constructor(private router: Router, private titleService: Title) {
    // Also see: https://stackoverflow.com/a/52355983
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd && event.snapshot.component !== undefined),
        tap(event => { if (this.onDebug) { console.log(event); } }),
        map(event => (<ActivationEnd>event).snapshot.data)
      )
      .subscribe(event => {
        this.title = event.Title || 'No route data defined!';
        this.titleService.setTitle('Cubes - ' + (this.title.trim() || 'Home'));
      });
  }
}
