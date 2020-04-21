import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cubes-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss', '../dialog-common.scss'],
})
export class AlertDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData,
    public dialogRef: MatDialogRef<AlertDialogComponent>
  ) {}
  ngOnInit() {}
}

export interface AlertDialogData {
  title: string;
  body: string;
}
