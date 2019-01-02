import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'cubes-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit() { }
  onOk() { this.dialogRef.close('OK'); }
}

export interface ConfirmDialogData {
  title: string;
  body: string;
  okText: string;
  cancelText: string;
}
