import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  @Output() addConnection = new EventEmitter<void>();

  public connections$: Observable<Connection[]>;
  public selectedIndex = -1;
  private selectedConnectionSub: Subscription;

  constructor(private store: DataAccessStore, private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.store.load();

    this.connections$ = this.store.connections;
    this.selectedConnectionSub = this.store
      .selectedConnection
      .subscribe(cnx => {
        this.selectedIndex = (cnx?.id) ?? -1;
        this.changeDetectorRef.detectChanges();
      });
  }
  ngOnDestroy(): void {
    if (this.selectedConnectionSub) {
      this.selectedConnectionSub.unsubscribe();
    }
  }

  selectConnection(cnx: Connection) {
    this.connectionSelected.emit(cnx);
  }

  onAddConnection() { this.addConnection.emit(); }
}
