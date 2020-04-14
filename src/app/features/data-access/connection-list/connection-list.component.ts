import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cubes-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionListComponent implements OnInit, OnDestroy {
  @Output() connectionSelected = new EventEmitter<Connection>();

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

  selectConnection(cnx: Connection) {
    this.connectionSelected.emit(cnx);
  }

  addConnection() {
    // TODO Check for pending changes ??
    this.store.addConnection();
  }
}
