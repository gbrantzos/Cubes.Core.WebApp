import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertDialogComponent, AlertDialogData } from '@shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public alert(message: string, title: string = 'Attention') {
    return this.dialog.open(AlertDialogComponent, {
      maxWidth: '490px',
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
