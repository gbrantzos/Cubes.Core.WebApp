import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss', '../data-access.common.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionListComponent implements OnInit, OnDestroy {
  @Output() connectionSelected = new EventEmitter<Connection>();
  @Output() newConnection = new EventEmitter<void>();

  public connections$: Observable<Connection[]>;
  public selectedIndex = -1;
  private subs = new SubSink();

  constructor(private store: DataAccessStore, private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.connections$ = this.store.connections;
    this.subs.sink = this.store
      .selectedConnection
      .subscribe(cnx => {
        this.selectedIndex = (cnx?.id) ?? -1;
        this.changeDetectorRef.detectChanges();
      });
  }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  selectConnection(cnx: Connection) { this.connectionSelected.emit(cnx); }
  onNew() { this.newConnection.emit(); }
}
