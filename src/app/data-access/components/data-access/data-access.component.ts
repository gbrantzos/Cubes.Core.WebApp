import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      panelClass: 'full-width-dialog',
      width: '100vw',
      height:  '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      hasBackdrop: false
    });
    // max-width: none !important;
    // https://github.com/angular/material2/issues/9823#issuecomment-363779100
  }
}



@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<div mat-dialog-content>
  <p>Full Screen Overlay!</p>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">Close</button>
</div>`
})
export class DialogOverviewExampleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
