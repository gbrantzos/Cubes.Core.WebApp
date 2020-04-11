import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../../@shared/services/loader.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();

    return next.handle(req)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.hideLoader();
          }
        }, err => this.hideLoader())
      );
  }

  private showLoader() { this.loaderService.show(); }
  private hideLoader() { this.loaderService.hide(); }
}
