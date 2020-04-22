import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { QueryExecutorParamsComponent } from '@features/data-access/query-executor-params/query-executor-params.component';
import { DataAccessApiClient, ExportSettings } from '@features/data-access/services/data-access.api-client';
import { Query } from '@features/data-access/services/data-access.store';
import { ColumnDefinition } from '@shared/components/dynamic-table/dynamic-table.component';
import { DialogService } from '@shared/services/dialog.service';
import { format } from 'date-fns';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cubes-query-executor',
  templateUrl: './query-executor.component.html',
  styleUrls: ['./query-executor.component.scss'],
})
export class QueryExecutorComponent implements OnInit {
  public query: Query;
  public connections: string[];
  public selectedConnection: string;
  public resultDetails: TableDetails;
  public exportSettings: ExportSettings = { separator: ';', includeHeaders: true };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this.onExecute();
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QueryExecutorComponent>,
    private dialogService: DialogService,
    private client: DataAccessApiClient,
    private matDialog: MatDialog
  ) {
    this.query = data.query;
    this.connections = data.connections;
    this.selectedConnection = data.selectedConnection;

    if (!this.selectedConnection && this.connections?.length) {
      this.selectedConnection = this.connections[0];
    }
  }
  ngOnInit(): void {
    this.client
      .getExportSettings()
      .pipe(take(1))
      .subscribe((s) => (this.exportSettings = s || { separator: ';', includeHeaders: true }));
  }

  onAcceptChanges(): void {
    this.dialogRef.close(this.query.queryCommand);
  }
  async onExecute() {
    let params = [];
    if (!this.selectedConnection) {
      this.dialogService.alert('You must first select a connection to use!');
      return;
    }
    if (this.query.parameters?.length) {
      const paramsResult = await this.matDialog
        .open(QueryExecutorParamsComponent, {
          minWidth: '420px',
          hasBackdrop: true,
          disableClose: true,
          data: {
            queryName: this.query.name,
            parameters: [...this.query.parameters],
          },
        })
        .afterClosed()
        .toPromise();
      if (!paramsResult) {
        return;
      }
      params = paramsResult;
    }
    this.resultDetails = null;
    this.client.executeQuery(this.query, this.selectedConnection, params).subscribe(
      (res) => {
        const results = res.results as any[];
        if (results.length === 0) {
          this.dialogService.snackWarning('No data returned from query execution!');
        } else {
          this.prepareResultDetails(results);
        }
      },
      (error) => {
        console.error(error);
        this.dialogService.alert(`Query execution failed!\n${error.error.message}`);
      }
    );
  }
  onExportResults() {
    const dateStr = format(new Date(), 'yyyyMMddHHmm');
    const filename = `${this.query.name}-DataExport-${dateStr}.csv`;
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (this.exportSettings.includeHeaders) {
      const firstRow = this.resultDetails.data[0];
      csvContent += Object.keys(firstRow).join(this.exportSettings.separator);
      csvContent += '\r\n';
    }
    this.resultDetails.data.forEach((dataRow) => {
      const row = Object.values(dataRow).join(this.exportSettings.separator);
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  }
  onSaveExportSettings(menu: MatMenuTrigger) {
    this.client.setExportSettings(this.exportSettings).subscribe(
      (response) => {
        menu.closeMenu();
        this.dialogService.snackMessage(response, 'Close');
      },
      (error) => {
        console.error(error);
        this.dialogService.alert(error.error.message);
      }
    );
  }

  private prepareResultDetails(result: any): void {
    const element = result[0];

    this.resultDetails = {
      data: result,
      columns: Object.keys(element).map((key) => {
        return {
          name: key,
          header: key,
          rowProperty: key,
        } as ColumnDefinition;
      }),
      displayedColumns: Object.keys(element),
      tableClass: 'mat-elevation-z1',
    };
  }
}

interface TableDetails {
  data: any;
  columns: ColumnDefinition[];
  displayedColumns: string[];
  tableClass?: string;
}
