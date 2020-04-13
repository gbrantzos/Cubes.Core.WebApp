import { Component, OnInit } from '@angular/core';
import { timer, merge, of } from 'rxjs';
import { delay, map, tap, finalize, flatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'cubes-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    const apiCall$ = of('API Result')
      .pipe(
        delay(1300),
      );
    const loaderDelay = 500;

    let callFinished: boolean;
    let loaderVisible: boolean;

    const call$ = of({})
      .pipe(
        tap(_ => {
          callFinished = false;
          loaderVisible = false;
          console.log('Starting API call');

          setTimeout(() => {
            if (!callFinished) {
              console.log('Show loader');
              this.spinner.show();
              loaderVisible = true;
            }
          }, loaderDelay);
        }),
        flatMap(() => apiCall$),
        map(v => {
          console.log(v);
        }),
        finalize(() => {
          callFinished = true;
          if (loaderVisible) {
            console.log('Hide loader');
            this.spinner.hide();
          }

          console.log('API call finished');
        })
      );


    call$.subscribe();
  }

}
