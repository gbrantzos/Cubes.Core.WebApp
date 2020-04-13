import { Component, OnInit, Inject, HostBinding, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ExportSettingsComponent } from '../export-settings/export-settings.component';

import { DialogService } from '@shared/services/dialog.service';
import { ColumnDefinition } from '@shared/components/dynamic-table/dynamic-table.component';
import { DataAccessService, ExportSettings } from '@core/services/data-access.service';
import { Query } from '@core/services/settings.service';

@Component({
  selector: 'cubes-execute-query',
  templateUrl: './execute-query.component.html',
  styleUrls: ['./execute-query.component.scss']
})
export class ExecuteQueryComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'base-component';

  public query: Query;
  public connections: string[];
  public selectedConnection: string;

  public resultDetails: TableDetails;
  public exportSettings: ExportSettings;
  private subscription: Subscription;

  constructor(
    private dataAccessService: DataAccessService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ExecuteQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.query = data.query;
    this.connections = data.connections;
    this.selectedConnection = data.selectedConnection;

    this.subscription = this
      .dataAccessService
      .getExportSettings()
      .subscribe(s => this.exportSettings = s);
  }

  ngOnInit() { }
  ngOnDestroy() { this.subscription.unsubscribe(); }

  onNoClick(): void { this.dialogRef.close(this.query.queryCommand); }
  onExecute() {
    this.resultDetails = null;
    this.dataAccessService
      .executeQuery(this.query, this.selectedConnection)
      .subscribe(res => {
        if (res && res.hasOwnProperty('results') && Array.isArray(res['results'])) {
          const results = res.results as any[];
          if (results.length === 0) {
            this.dialogService.alert('No data returned from query execution!');
          } else {
            this.prepareResultDetails(results);
          }
        } else {
          console.error(res);
          this.dialogService.alert('Could not parse results!');
        }
      }, errorResponse => {
        console.error(errorResponse);
        this.dialogService.alert(`Error executing query:<br>${errorResponse.error.message}`);
      });
  }
  onExportResults() {
    /* cspell: disable-next-line */
    const filename = `${this.query.name}-DataExport-${moment().format('YYYYMMDDHHmmss')}.csv`;
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (this.exportSettings.includeHeaders) {
      const firstRow = this.resultDetails.data[0];
      csvContent += Object.keys(firstRow).join(this.exportSettings.separator);
      csvContent += '\r\n';
    }
    this.resultDetails.data.forEach(dataRow => {
      const row = Object.values(dataRow).join(this.exportSettings.separator);
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link); // Required for FF

    link.click();
  }
  onExportSettings() {
    this
      .dialog
      .open(ExportSettingsComponent, {
        hasBackdrop: true,
        width: '320px',
        data: Object.assign({}, this.exportSettings)
      })
      .afterClosed()
      .subscribe(settings => {
        if (settings) {
          this.exportSettings = settings;
          this
            .dataAccessService
            .setExportSettings(settings as ExportSettings)
            .subscribe(response => {
              this.displayMessage(response);
            }, error => {
              console.log(error);
              this.displayMessage(error.error.message);
            });
          }
      });
  }

  private prepareResultDetails(result: any): void {
    const element = result[0];

    this.resultDetails = {
      data: result,
      columns: Object.keys(element).map(key => {
        return {
          name: key,
          header: key,
          rowProperty: key,
          // columnClass: typeof(element[key]) === 'number' ? 'cell-right' : 'cell-left'
        } as ColumnDefinition;
      }),
      displayedColumns: Object.keys(element),
      tableClass: 'mat-elevation-z1'
    };
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

interface TableDetails {
  data: any;
  columns: ColumnDefinition[];
  displayedColumns: string[];
  tableClass?: string;
}
