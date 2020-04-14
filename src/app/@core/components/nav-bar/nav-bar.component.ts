import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { AuthService, UserDetails } from '@core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { filter, tap, map } from 'rxjs/operators';

@Component({
  selector: 'cubes-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() showMenuIcon = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  public user: UserDetails;

  private onDebug = false; // Enable this for debugging!

  constructor(
    private authService: AuthService,
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
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggleSidenav() { this.toggleSidenav.emit(); }

}
