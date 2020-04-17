import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'cubes-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() isHidden = false;
  @ViewChild('sidenav') sidenav: MatSidenav;

  // TODO Configuration ?? API ?? Definitely not here
  public navItems = [
    {
      label: 'Scheduler',
      icon: 'fa-calendar',
      link: '/scheduler'
    }, {
      label: 'Data Access',
      icon: 'fa-database',
      link: '/data'
    }, {
      label: 'Settings',
      icon: 'fa-sliders-h',
      link: '/settings'
    }, {
      label: 'About',
      icon: 'fa-question-circle',
      link: '/about'
    },
  ];

  get opened() { return this.sidenav.opened; }
  constructor() { }
  ngOnInit(): void { }

  toggle() { this.sidenav.toggle(); }
}
