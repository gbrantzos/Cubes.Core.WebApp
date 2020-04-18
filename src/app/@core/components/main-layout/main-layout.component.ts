import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SideNavComponent } from '@core/components/side-nav/side-nav.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UiManagerService, UiEventType, UiEvent } from '@core/services/ui-manager.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'cubes-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sideNav') sideNav: SideNavComponent;
  private breakpointSub: Subscription = null;
  private routerSub: Subscription = null;
  private uiSpinnerSub: Subscription = null;
  private defaultSpinnerMessage = 'Please wait ...';

  public spinnerMessage = 'Please wait ...';
  public hideSidenav = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private spinner: NgxSpinnerService,
    private uiManager: UiManagerService
  ) { }

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
    this.uiSpinnerSub = this.uiManager.on([UiEventType.ShowSpinner, UiEventType.HideSpinner], (event: UiEvent) => {
      switch (event.eventType) {
        case UiEventType.ShowSpinner:
          if (event.value) { this.spinnerMessage = event.value; }
          this.spinner.show();
          break;
        case UiEventType.HideSpinner:
          this.spinner.hide();
          this.spinnerMessage = this.defaultSpinnerMessage;
          break;
        default:
          break;
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
    if (this.uiSpinnerSub) {
      this.uiSpinnerSub.unsubscribe();
    }
  }

  onToggleSidenav() { this.sideNav.toggle(); }
}
