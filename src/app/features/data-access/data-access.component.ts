import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { UiEventType, UiManagerService } from '@core/services/ui-manager.service';
import { ConnectionEditorComponent } from '@features/data-access/connection-editor/connection-editor.component';
import { DefaultQueriesComponent } from '@features/data-access/default-queries/default-queries.component';
import { QueryEditorComponent } from '@features/data-access/query-editor/query-editor.component';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { Connection, DataAccessStore, Query } from '@features/data-access/services/data-access.store';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss'],
})
export class DataAccessComponent implements OnInit {
  @ViewChild('connectionForm') connectionForm: ConnectionEditorComponent;
  @ViewChild('queryForm') queryForm: QueryEditorComponent;
  public tabIndex = 0;

  constructor(
    public store: DataAccessStore,
    private dialogService: DialogService,
    private apiClient: DataAccessApiClient,
    private route: ActivatedRoute,
    private location: Location,
    private matDialog: MatDialog,
    private uiManager: UiManagerService
  ) {}

  ngOnInit(): void {
    const view = this.route.snapshot.paramMap.get('view') ?? 'connections';
    this.tabIndex = view === 'connections' ? 0 : view === 'queries' ? 1 : 0;
    this.store.loadData();
  }

  async reload() {
    if (this.connectionForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    if (this.queryForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected query.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.loadData();
  }

  async connectionSelected(cnx: Connection) {
    if (this.connectionForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.selectConnection(cnx.id);
  }

  async newConnection() {
    if (this.connectionForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.newConnection();
  }

  testConnection(connection: Connection) {
    this.uiManager.emit(UiEventType.ShowSpinner, 'Testing connection ...');
    this.apiClient.testConnection(connection).subscribe(
      (result) => {
        this.uiManager.emit(UiEventType.HideSpinner);
        this.dialogService.snackInfo(result);
      },
      (error) => {
        console.error(error);
        this.uiManager.emit(UiEventType.HideSpinner);
        this.dialogService.snackError((error.error || error.message) + '.');
      }
    );
  }

  async querySelected(qry: Query) {
    if (this.queryForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected query.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.selectQuery(qry.id);
  }

  async newQuery() {
    if (this.queryForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new query.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.newQuery();
  }

  tabChanged(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.location.replaceState('data/connections');
        break;
      case 1:
        this.location.replaceState('data/queries');
        break;
      default:
        break;
    }
  }

  async addDefault() {
    if (this.queryForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected query.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }

    this.store.defaultQueries().subscribe((data) => this.selectDefault(data));
  }

  private selectDefault(names: string[]) {
    this.matDialog
      .open(DefaultQueriesComponent, {
        minWidth: '420px',
        hasBackdrop: true,
        disableClose: true,
        data: { names },
      })
      .afterClosed()
      .subscribe((r) => {
        if (r) {
          this.store.addDefaultQuery(r);
        }
      });
  }
}
