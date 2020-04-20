import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SideNavComponent } from '@core/components/side-nav/side-nav.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UiManagerService, UiEventType, UiEvent } from '@core/services/ui-manager.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sideNav') sideNav: SideNavComponent;
  private subs = new SubSink();
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
    this.subs.sink = this.breakpointObserver
      .observe(['(min-width: 699px)'])
      .subscribe((state: BreakpointState) => {
        this.hideSidenav = !state.matches;
      });
    this.subs.sink = this.router
      .events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(e => {
        if (this.hideSidenav && this.sideNav.opened) {
          this.sideNav.toggle();
        }
      });
    this.subs.sink = this.uiManager.on([UiEventType.ShowSpinner, UiEventType.HideSpinner], (event: UiEvent) => {
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

  ngOnDestroy(): void { this.subs.unsubscribe(); }
  onToggleSidenav() { this.sideNav.toggle(); }
}
