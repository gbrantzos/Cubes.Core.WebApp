import { Component, OnInit, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable, empty } from 'rxjs';
import { SchemaService, CoreSchemas } from '@src/app/shared/services/schema.service';
import { SettingsService, DataAccessSettings, Connection, Query } from '@src/app/core/services/settings.service';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { DataConnectionService } from '@src/app/core/services/data-connection.service';
import { ExecuteQueryComponent } from '../execute-query/execute-query.component';

interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}


@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {
  @HostBinding('class') class = 'base-component';

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
    private connectionService: DataConnectionService,
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
    console.log(`Testing connection ${connection.name} ...`);
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
        query: query,
        connections: this.connectionNames
      }
    });
  }
}
