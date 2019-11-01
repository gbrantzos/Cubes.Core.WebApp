import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivationEnd } from '@angular/router';
import { map, filter, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'cubes-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  public navItems = [
    {
      label: 'Scheduler',
      icon: 'fa fa-fw fa-calendar',
      link: '/scheduler'
    }, {
      label: 'Data Access',
      icon: 'fa fa-fw fa-database',
      link: '/data'
    }, {
      label: 'Settings',
      icon: 'fa fa-fw fa-cogs',
      link: '/settings'
    }, {
      label: 'About',
      icon: 'fa fa-fw fa-question-circle',
      link: '/about'
    },
  ];

  public title = '';
  public hideSidenav = false;
  private onDebug = false; // Enable this for debugging!
  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;

  constructor(private router: Router,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver) {
    // Also see: https://stackoverflow.com/a/52355983
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd && event.snapshot.component !== undefined),
        tap(event => { if (this.onDebug) { console.log(event); } }),
        map(event => (<ActivationEnd>event).snapshot.data)
      )
      .subscribe(event => {
        this.title = event.Title;
        const title = this.title ? 'Cubes - ' + (this.title.trim() || 'Home') : 'Cubes';
        if (this.title) { this.titleService.setTitle(title); }
      });
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 699px)'])
      .subscribe((state: BreakpointState) => { this.hideSidenav = !state.matches; });
  }
}
