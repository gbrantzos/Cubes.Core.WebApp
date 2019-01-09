import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';
import { Router, ActivationEnd } from '@angular/router';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'cubes-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  public title = '';
  @ViewChild('drawer') public sidenav: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    // Also see: https://stackoverflow.com/a/52355983
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map(event => (<ActivationEnd>event).snapshot.data)
      )
      .subscribe(event => {
        this.title = event.Title || 'No route data defined!';
        // setTimeout(() => this.sidenav.close(), 120);
      });
  }
}
