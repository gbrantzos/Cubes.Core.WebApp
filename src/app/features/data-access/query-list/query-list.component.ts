import { Component, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Query, DataAccessStore } from '@features/data-access/services/data-access.store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cubes-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.scss', '../data-access.common.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryListComponent implements OnInit, OnDestroy {
  @Output() querySelected = new EventEmitter<Query>();
  @Output() newQuery = new EventEmitter<void>();

  public queries$: Observable<Query[]>;
  public selectedIndex = -1;
  private selectedQuerySub: Subscription;

  constructor(private store: DataAccessStore, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.queries$ = this.store.queries;
    this.selectedQuerySub = this.store
      .selectedQuery
      .subscribe(cnx => {
        this.selectedIndex = (cnx?.id) ?? -1;
        this.changeDetectorRef.detectChanges();
      });
  }
  ngOnDestroy(): void {
    if (this.selectedQuerySub) {
      this.selectedQuerySub.unsubscribe();
    }
  }

  selectQuery(qry: Query) {
    this.querySelected.emit(qry);
  }

  onNew() { this.newQuery.emit(); }
}
