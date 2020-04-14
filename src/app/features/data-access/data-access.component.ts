import { Component, OnInit, ViewChild } from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { ConnectionEditorComponent } from '@features/data-access/connection-editor/connection-editor.component';
import { DialogService } from '@shared/services/dialog.service';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {
  @ViewChild('form') form: ConnectionEditorComponent;

  constructor(
    public store: DataAccessStore,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private apiClient: DataAccessApiClient,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void { }

  async reload() {
    if (this.form.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.loadData();
  }

  async connectionSelected(cnx: Connection) {
    if (this.form.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.selectConnection(cnx.id);
  }

  async addConnection() {
    if (this.form.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new connection.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) { return; }
    }
    this.store.addConnection();
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

  private displayMessage(message: string) {
    const snackRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
