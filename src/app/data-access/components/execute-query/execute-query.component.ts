import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Query } from '@src/app/core/services/settings.service';

@Component({
  selector: 'cubes-execute-query',
  templateUrl: './execute-query.component.html',
  styleUrls: ['./execute-query.component.scss']
})
export class ExecuteQueryComponent implements OnInit {
  public query: Query;
  constructor(
    private dialogRef: MatDialogRef<ExecuteQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { console.log(data); this.query = data.query; }

  ngOnInit() { }
  onNoClick(): void { this.dialogRef.close(); }
}
