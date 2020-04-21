import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'cubes-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public hide = true;
  public working = false;
  public errorMessage = '';
  public enableAdminUser = false;
  public hidden = true;

  public username: string;
  public password: string;

  private redirectUrl: string;
  private defaultRedirect = '/home';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.redirectUrl =
      this.route.snapshot.queryParams.redirectUrl || this.defaultRedirect;

    if (this.authService.isLogged) {
      // If user is logged in, goto main component
      this.router.navigate([this.defaultRedirect]);
    } else {
      // Used to avoid flickering!
      this.hidden = false;
    }
  }

  login() {
    this.working = true;
    this.errorMessage = '';

    this.authService
      .login({
        userID: this.username,
        password: this.password,
      })
      .pipe(finalize(() => (this.working = false)))
      .subscribe(
        (_) => {
          this.router.navigateByUrl(this.redirectUrl);
        },
        (error) => {
          console.error(error);
          this.errorMessage = error;
        }
      );
  }
}
