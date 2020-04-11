import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLogged) {
      return true;
    }

    const redirectUrl = state.url;
    this.router.navigateByUrl(
      this.router.createUrlTree(['/login'], { queryParams: { redirectUrl } })
    );
    return false;
  }
}
