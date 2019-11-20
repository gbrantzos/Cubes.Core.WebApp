import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Query } from '@src/app/core/services/settings.service';
import { DataAccessService } from '@src/app/core/services/data-access.service';
import { ColumnDefinition } from '@src/app/shared/components/dynamic-table/dynamic-table.component';
import { DialogService } from '@src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-execute-query',
  templateUrl: './execute-query.component.html',
  styleUrls: ['./execute-query.component.scss']
})
export class ExecuteQueryComponent implements OnInit {
  @HostBinding('class') class = 'base-component';

  public query: Query;
  public connections: string[];
  public selectedConnection: string;

  public resultDetails: TableData;

  constructor(
    private dataAccessService: DataAccessService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<ExecuteQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.query = data.query;
    this.connections = data.connections;
    this.selectedConnection = data.selectedConnection;
  }

  ngOnInit() { }
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
    const filename = 'export-data.csv';
    let csvContent = 'data:text/csv;charset=utf-8,';

    this.resultDetails.data.forEach(dataRow => {
      const row = Object.values(dataRow).join(';');
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

interface TableData {
  data: any;
  columns: ColumnDefinition[];
  displayedColumns: string[];
  tableClass?: string;
}
