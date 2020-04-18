import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UiManagerService {
  private readonly bus$ = new Subject<UiEvent>();
  constructor() { }

  on(eventType: UiEventType | Array<UiEventType>, action: (event: UiEvent) => void): Subscription {
    return this.bus$
      .pipe(
        filter(e => (Array.isArray(eventType))
          ? eventType.includes(e.eventType)
          : e.eventType === eventType
        )
      )
      .subscribe(e => action(e));
  }

  emit(eventType: UiEventType, value?: any) { this.bus$.next({ eventType, value }); }
}

export interface UiEvent {
  eventType: UiEventType;
  value?: any;
}

export enum UiEventType {
  ShowSpinner,
  HideSpinner
}
