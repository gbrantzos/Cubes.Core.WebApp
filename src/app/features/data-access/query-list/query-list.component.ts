import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DataAccessStore, Query } from '@features/data-access/services/data-access.store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.scss', '../data-access.common.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryListComponent implements OnInit, OnDestroy {
  @Output() querySelected = new EventEmitter<Query>();
  @Output() addDefault = new EventEmitter<void>();
  @Output() newQuery = new EventEmitter<void>();

  public queries$: Observable<Query[]>;
  public selectedIndex = -1;
  private subs = new SubSink();

  constructor(private store: DataAccessStore, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.queries$ = this.store.queries;
    this.subs.sink = this.store.selectedQuery.subscribe((cnx) => {
      this.selectedIndex = cnx?.id ?? -1;
      this.changeDetectorRef.detectChanges();
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectQuery(qry: Query) {
    this.querySelected.emit(qry);
  }
  onNew() {
    this.newQuery.emit();
  }
  onAddDefault() {
    this.addDefault.emit();
  }
}
