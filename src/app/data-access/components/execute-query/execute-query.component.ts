import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Query } from '@src/app/core/services/settings.service';
import { DataAccessService } from '@src/app/core/services/data-access.service';

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
      });
  }
}
