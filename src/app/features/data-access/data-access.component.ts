import { Component, OnInit, ViewChild } from '@angular/core';
import { DataAccessStore, Connection, Query } from '@features/data-access/services/data-access.store';
import { ConnectionEditorComponent } from '@features/data-access/connection-editor/connection-editor.component';
import { DialogService } from '@shared/services/dialog.service';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { QueryEditorComponent } from '@features/data-access/query-editor/query-editor.component';
import { Location } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {
  @ViewChild('connectionForm') connectionForm: ConnectionEditorComponent;
  @ViewChild('queryForm') queryForm: QueryEditorComponent;
  public tabIndex = 0;

  constructor(
    public store: DataAccessStore,
    private dialogService: DialogService,
    private apiClient: DataAccessApiClient,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const view = this.route.snapshot.paramMap.get('view') ?? 'connections';
    this.tabIndex =
      view === 'connections' ? 0 :
        view === 'queries' ? 1 : 0;
    this.store.loadData();
  }

  async reload() {
    if (this.connectionForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.loadData();
  }

  async connectionSelected(cnx: Connection) {
    if (this.connectionForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.selectConnection(cnx.id);
  }

  async newConnection() {
    if (this.connectionForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.newConnection();
  }

  testConnection(connection: Connection) {
    this.spinner.show();
    this.apiClient
      .testConnection(connection)
      .subscribe(result => {
        this.spinner.hide();
        this.displayMessage(result);
      }, error => {
        console.error(error);
        this.spinner.hide();
        this.displayMessage(error.error.message + '.');
      });
  }

  async querySelected(qry: Query) {
    if (this.queryForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected query.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.selectQuery(qry.id);
  }

  async newQuery() {
    if (this.queryForm.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new query.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
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
  // It sucks since change has already occurred, but WTF?
  // async tabChanged(event: MatTabChangeEvent) {
  //   console.log(event);
  //   if (event.index === 1) {
  //     if (this.connectionForm.pendingChanges()) {
  //       const dialogResult = await this.dialogService
  //         .confirm('There are unsaved changes on current connection.\nDiscard and continue?')
  //         .toPromise();
  //       if (!dialogResult) { this.tabIndex = 0; }
  //     }
  //   }
  //   if (event.index === 0) {
  //     if (this.queryForm.pendingChanges()) {
  //       const dialogResult = await this.dialogService
  //         .confirm('There are unsaved changes on current query.\nDiscard and continue?')
  //         .toPromise();
  //       if (!dialogResult) { this.tabIndex = 1; }
  //     }
  //   }
  // }

  private displayMessage(message: string) {
    const snackRef = this.dialogService.snackMessage(message, 'Close', {
      duration: 3000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
