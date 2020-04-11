import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { AuthService, UserDetails } from '@core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { filter, tap, map } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'cubes-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public user: UserDetails;
  public hideSidenav = false;

  private onDebug = false; // Enable this for debugging!

  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;
  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    // Also see: https://stackoverflow.com/a/52355983
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd && event.snapshot.component !== undefined),
        tap(event => { if (this.onDebug) { console.log(event); } }),
        map(event => (<ActivationEnd>event).snapshot.data)
      )
      .subscribe(event => {
        // TODO Check if needed
        // this.title = event.Title;
        // const title = this.title ? 'Cubes - ' + (this.title.trim() || 'Home') : 'Cubes';
        // if (this.title) { this.titleService.setTitle(title); }
      });
  }

  ngOnInit(): void {
    this.user = this.authService.loggedUser;
    this.breakpointObserver
      .observe(['(min-width: 699px)'])
      .subscribe((state: BreakpointState) => { this.hideSidenav = !state.matches; });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
