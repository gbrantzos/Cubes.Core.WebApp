import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExecuteQueryComponent } from '../execute-query/execute-query.component';
import { QueryComponent } from '../query/query.component';
import { SchemaService, CoreSchemas } from '@shared/services/schema.service';
import { DialogService } from '@shared/services/dialog.service';
import { SettingsService, DataAccessSettings, Connection, Query } from '@core/services/settings.service';
import { DataAccessService } from '@core/services/data-access.service';


@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {
  @HostBinding('class') class = 'base-component';
  @ViewChild('queries') queries: QueryComponent;

  public data$: Observable<any>;
  public errorLoading = false;
  public errorMessage = '';

  public selectedTab: 0;
  public selectedConnection: '-- NONE --';
  public selectedQuery: '-- NONE --';

  private connectionNames;

  constructor(
    private schemaService: SchemaService,
    private settingsService: SettingsService,
    private connectionService: DataAccessService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }
  ngOnInit() { this.loadData(); }

  public loadData() {
    this.data$ = forkJoin(
      this.schemaService.getSchema(CoreSchemas.DataConnection),
      this.schemaService.getSchema(CoreSchemas.DataQueries),
      this.settingsService.getDataAccess()
    ).pipe(
      map(([schemaConnection, schemaQuery, model]) => {
        this.connectionNames = model.connections.map(c => c.name);
        return {
          schema: {
            connection: schemaConnection,
            query: schemaQuery
          },
          model
        };
      }),
      catchError((err) => {
        this.errorLoading = true;
        this.errorMessage = err.message;

        this.displayMessage(this.errorMessage);
        console.error(err);
        return empty();
      })
    );
  }

  private displayMessage(message: string) {
    const snackRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }

  public onSave(data: DataAccessSettings) {
    this.settingsService
      .saveDataAccess(data)
      .subscribe(res => {
        this.displayMessage(res || 'Data Access settings saved!');
        this.loadData();
      });
  }

  public onTestConnection(connection: Connection) {
    this.connectionService
      .testConnection(connection)
      .subscribe(result => {
        this.displayMessage(result);
      }, error => {
        console.error(error);
        this.displayMessage(error.error.message);
      });
  }

  public onConnectionChanged(connection) { if (connection) { this.selectedConnection = connection; } }

  public onQueryChanged(query) { if (query) { this.selectedQuery = query; } }

  public onExecuteQuery(query: Query) {
    this.dialog.open(ExecuteQueryComponent, {
      panelClass: 'full-width-dialog',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      hasBackdrop: true,
      disableClose: true,
      data: {
        query: Object.assign({}, query),
        connections: this.connectionNames,
        selectedConnection: this.selectedConnection
      }
    })
    .afterClosed()
    .subscribe(result => {
      if (result !== query.queryCommand) {
        this.dialogService
          .confirm('Query command has changed. Update command on query <strong>' + query.name + '</strong>?')
          .subscribe(resultOk => {
            if (resultOk) {
              setTimeout(() => this.queries.updateQueryCommand(query.id, result));
            }
          });
      }
    });
  }
}
