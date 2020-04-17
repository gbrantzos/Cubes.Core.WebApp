import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertDialogComponent, AlertDialogData } from '@shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarConfig, SimpleSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

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

  public snackMessage(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, config);
  }

  public snackInfo(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-info']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackSuccess(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-success']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackWarning(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-warning']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackError(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-error']
    };
    return this.snackBar.open(message, action, cnf);
  }
}
