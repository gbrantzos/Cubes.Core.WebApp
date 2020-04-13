import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SideNavComponent } from '@core/components/side-nav/side-nav.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cubes-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sideNav') sideNav: SideNavComponent;
  private breakpointSub: Subscription = null;
  private routerSub: Subscription = null;

  public hideSidenav = false;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) { }

  ngOnInit(): void {
    this.breakpointSub = this.breakpointObserver
      .observe(['(min-width: 699px)'])
      .subscribe((state: BreakpointState) => {
        this.hideSidenav = !state.matches;
      });
    this.routerSub = this.router
      .events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(e => {
        if (this.hideSidenav && this.sideNav.opened) {
          this.sideNav.toggle();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.breakpointSub) {
      this.breakpointSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  onToggleSidenav() { this.sideNav.toggle(); }
}
