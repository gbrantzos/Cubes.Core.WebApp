import { Component } from '@angular/core';

@Component({
  selector: 'cubes-root',
  template: `
  <cubes-main-nav class="full-height">
    <router-outlet></router-outlet>
  </cubes-main-nav>
  `,
  styles: [`
  .full-height {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  `]
})
export class AppComponent { }
