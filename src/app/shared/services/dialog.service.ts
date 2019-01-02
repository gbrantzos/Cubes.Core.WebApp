import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent, AlertDialogData } from '../components/alert-dialog/alert-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public alert(message: string, title: string = 'Attention') {
    return this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        body: message
      } as AlertDialogData
    });
  }

  public confirm(message: string, title: string = 'Confirm'): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: title,
          body: message,
          okText: 'OK',
          cancelText: 'Cancel'
        } as ConfirmDialogData
      })
      .afterClosed()
      .pipe(
        map(res => res === 'OK')
      );
  }
}
