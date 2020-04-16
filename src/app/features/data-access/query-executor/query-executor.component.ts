import { Component, OnInit, Inject, OnDestroy, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Query } from '@features/data-access/services/data-access.store';
import { DataAccessApiClient, ExportSettings } from '@features/data-access/services/data-access.api-client';
import { ColumnDefinition } from '@shared/components/dynamic-table/dynamic-table.component';
import { DialogService } from '@shared/services/dialog.service';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cubes-query-executor',
  templateUrl: './query-executor.component.html',
  styleUrls: ['./query-executor.component.scss']
})
export class QueryExecutorComponent implements OnInit {
  public query: Query;
  public connections: string[];
  public selectedConnection: string;
  public resultDetails: TableDetails;
  public exportSettings: ExportSettings;

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
    private client: DataAccessApiClient
  ) {
    this.query = data.query;
    this.connections = data.connections;
    this.selectedConnection = data.selectedConnection;
  }
  ngOnInit(): void {
    this.client
      .getExportSettings()
      .pipe(take(1))
      .subscribe(s => this.exportSettings = s);
  }

  onAcceptChanges(): void { this.dialogRef.close(this.query.queryCommand); }
  onExecute() {
    if (!this.selectedConnection) {
      this.dialogService.alert('You must first select a connection to use!');
      return;
    }
    this.resultDetails = null;
    this.client
      .executeQuery(this.query, this.selectedConnection)
      .subscribe(res => {
        const results = res.results as any[];
        if (results.length === 0) {
          this.dialogService.alert('No data returned from query execution!');
        } else {
          this.prepareResultDetails(results);
        }
      });
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
}

interface TableDetails {
  data: any;
  columns: ColumnDefinition[];
  displayedColumns: string[];
  tableClass?: string;
}
