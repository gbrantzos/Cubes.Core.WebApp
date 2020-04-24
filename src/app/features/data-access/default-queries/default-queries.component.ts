import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cubes-default-queries',
  templateUrl: './default-queries.component.html',
  styleUrls: ['./default-queries.component.scss'],
})
export class DefaultQueriesComponent implements OnInit {
  public names: string[];
  public selected: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<DefaultQueriesComponent>) {
    this.names = data.names;
  }

  ngOnInit(): void {}
  onSelect() {
    this.dialogRef.close(this.selected);
  }
}
