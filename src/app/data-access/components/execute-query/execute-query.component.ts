import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Query } from '@src/app/core/services/settings.service';
import { DataAccessService } from '@src/app/core/services/data-access.service';
import { ColumnDefinition } from '@src/app/shared/components/dynamic-table/dynamic-table.component';

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
  public result: any;

  public columns: ColumnDefinition[] = [
    {
      name: 'id',
      header: 'ID',
      rowProperty: 'id'
    },
    {
      name: 'description',
      header: 'Description',
      rowProperty: 'description'
    }
  ];
  public displayedColumns = ['id', 'description'];
  public tableData = [
    { id: 1, description: 'ID 1'},
    { id: 2, description: 'ID 2'},
    { id: 3, description: 'ID 3'},
    { id: 4, description: 'ID 4'},
    { id: 5, description: 'ID 5'},
  ];


  constructor(
    private dataAccessService: DataAccessService,
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
    this.dataAccessService
      .executeQuery(this.query, this.selectedConnection)
      .subscribe(res => {
        console.log(res);
        this.result = res;
      }, errorResponse => {
        console.error(errorResponse);
        alert(errorResponse.error.message);
      });
  }

  private prepareTableData(result: any): TableData {
    const toReturn: TableData = {
      data: result,
      columns: Object.keys(result).map(k => {
        return {
          name: k,
          header: k,
          rowProperty: k
        } as ColumnDefinition;
      }),
      displayedColumns: Object.keys(result),
      tableClass: 'mat-elevation-z1'
    };

    return toReturn;
  }
}

interface TableData {
  data: any;
  columns: ColumnDefinition[];
  displayedColumns: string[];
  tableClass?: string;
}
