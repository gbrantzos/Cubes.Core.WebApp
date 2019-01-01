import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent, DialogData } from '../components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  alert(message: string) {
    return this.dialog.open(AlertDialogComponent, {
      panelClass: 'dialogs-container',
      data: {
        title: 'Attention',
        body: message
      } as DialogData
    });
  }
}
