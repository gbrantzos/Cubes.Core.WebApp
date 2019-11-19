import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Query } from '@src/app/core/services/settings.service';

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

  constructor(
    private dialogRef: MatDialogRef<ExecuteQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.query = data.query;
    this.connections = data.connections;
    this.selectedConnection = data.selectedConnection;
  }

  ngOnInit() { }
  onNoClick(): void { this.dialogRef.close(this.query.queryCommand); }
}
