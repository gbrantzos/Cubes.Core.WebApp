import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '@src/app/shared/services/loader.service';

@Component({
  selector: 'cubes-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  public show = false;
  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.subscription = this
      .loaderService
      .loaderState
      .subscribe(state => { this.show = state.show; });
  }
  ngOnDestroy(): void { this.subscription.unsubscribe(); }

}
