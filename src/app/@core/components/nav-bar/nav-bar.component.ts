import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserDetails } from '@core/services/auth.service';

@Component({
  selector: 'cubes-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() showMenuIcon = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  public user: UserDetails;

  constructor(
    private authService: AuthService,
    private router: Router) {

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
