import { Component, OnInit } from '@angular/core';
import { timer, merge } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'cubes-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('On init');
    const apiCall$ = timer(500).pipe(map(d => 'Api call ' + d));
    const loaderDelay$ = timer(1200).pipe(map(d => 'Show loader ' + d));

    const call$ = merge(apiCall$, loaderDelay$);

    apiCall$.subscribe(v => console.log(v));
  }

}
