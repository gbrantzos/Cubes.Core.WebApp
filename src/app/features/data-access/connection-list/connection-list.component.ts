import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cubes-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionListComponent implements OnInit, OnDestroy {
  public connections$: Observable<Connection[]>;
  public selectedIndex = 0;
  private selectedConnectionSub: Subscription;

  constructor(private store: DataAccessStore) { }
  ngOnInit(): void {
    this.store.load();

    this.connections$ = this.store.connections;
    this.selectedConnectionSub = this.store
      .selectedConnection
      .subscribe(cnx => this.selectedIndex = (cnx?.id) ?? 0);
  }
  ngOnDestroy(): void {
    if (this.selectedConnectionSub) {
      this.selectedConnectionSub.unsubscribe();
    }
  }

  selectConnection(id: number) {
    this.selectedIndex = id;
    this.store.selectConnection(id);
  }
}
