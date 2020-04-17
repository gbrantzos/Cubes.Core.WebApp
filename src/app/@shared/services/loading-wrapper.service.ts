import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, flatMap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingWrapperService {
  private readonly loaderDelay: number;

  constructor(private spinner: NgxSpinnerService) { this.loaderDelay = 500; }

  public wrap<T>(call: Observable<T>): Observable<T> {
    let callFinished: boolean;
    let loaderVisible: boolean;

    const call$ = of<T>(null)
      .pipe(
        tap(_ => {
          callFinished = false;
          loaderVisible = false;
          // console.log('Starting API call');

          setTimeout(() => {
            if (!callFinished) {
              // console.log('Showing loader');
              this.spinner.show();
              loaderVisible = true;
            }
          }, this.loaderDelay);
        }),
        flatMap(() => call),
        finalize(() => {
          callFinished = true;
          if (loaderVisible) {
            // console.log('Hide loader');
            this.spinner.hide();
          }

          // console.log('API call finished');
        })
      );

    return call$;
  }
}
