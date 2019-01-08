import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Router, ActivationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'cubes-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  public title = '';
  @ViewChild('drawer') public sidenav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

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
