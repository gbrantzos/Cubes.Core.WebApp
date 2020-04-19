import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ConfigurationService, SideNavItem } from '@core/services/configuration.service';

@Component({
  selector: 'cubes-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() isHidden = false;
  @ViewChild('sidenav') sidenav: MatSidenav;

  public navItems: SideNavItem[];
  get opened() { return this.sidenav.opened; }

  constructor(config: ConfigurationService) { this.navItems = config.sideNavItems; }
  ngOnInit(): void { }

  toggle() { this.sidenav.toggle(); }
}
