import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { forkJoin, Observable, empty } from 'rxjs';
import { SchemaService, CoreSchemas } from '@src/app/shared/services/schema.service';
import { SettingsService, DataAccessSettings, Connection } from '@src/app/core/services/settings.service';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { DataConnectionService } from '@src/app/core/services/data-connection.service';

interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel'
};

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {
  @HostBinding('class') class = 'base-component';

  public data$: Observable<any>;
  public errorLoading = false;
  public errorMessage = '';

  constructor(
    private schemaService: SchemaService,
    private settingsService: SettingsService,
    private connectionService: DataConnectionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private overlay: Overlay) { }
  ngOnInit() { this.loadData(); }

  public loadData() {
    this.data$ = forkJoin(
      this.schemaService.getSchema(CoreSchemas.DataConnection),
      this.schemaService.getSchema(CoreSchemas.DataQueries),
      this.settingsService.getDataAccess()
    ).pipe(
      map(([schemaConnection, schemaQuery, model]) => {
        return {
          schema: {
            connection: schemaConnection,
            query: schemaQuery
          },
          model
        };
      }),
      catchError((err, caught) => {
        this.errorLoading = true;
        this.errorMessage = err.message;

        this.displayMessage(this.errorMessage);
        console.error(err);
        return empty();
      })
    );
  }

  private displayMessage(message: string) {
    const snackRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }

  public onSave(data: DataAccessSettings) {
    this.settingsService
      .saveDataAccess(data)
      .subscribe(res => {
        this.displayMessage(res || 'Data Access settings saved!');
        this.loadData();
      });
  }

  public onTestConnection(connection: Connection) {
    console.log(`Testing connection ${connection.name} ...`);
    this.connectionService
      .testConnection(connection)
      .subscribe(result => {
        this.displayMessage(result);
      }, error => {
        console.error(error);
        this.displayMessage(error.error.message);
      });
  }

  openDialogOverlay(config: FilePreviewDialogConfig = {}) {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Create ComponentPortal that can be attached to a PortalHost
    const filePreviewPortal = new ComponentPortal(FilePreviewOverlayComponent);

    // Attach ComponentPortal to PortalHost
    overlayRef.attach(filePreviewPortal);

    setTimeout(() => {
      overlayRef.dispose();
    }, 3000);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      panelClass: 'full-width-dialog',
      backdropClass: 'backdrop1',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      hasBackdrop: true,
      disableClose: true
    });
    // max-width: none !important;
    // https://github.com/angular/material2/issues/9823#issuecomment-363779100
  }

  private createOverlay(config: FilePreviewDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
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


@Component({
  selector: 'file-preview-overlay',
  template: `
  <mat-card class="example-card">
      <mat-card-content>

        <form class="example-form">
          <mat-form-field class="example-full-width">
            <input matInput placeholder="Favorite food" value="Sushi">
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <textarea matInput placeholder="Leave a comment"></textarea>
          </mat-form-field>
        </form>

      </mat-card-content>
      <mat-card-actions>
        <button mat-button>LIKE</button>
        <button mat-button>SHARE</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      background: white;
    }

    h1 {
      margin: 0;
      padding: 1em;
    }

    .example-card {
      max-width: 400px;
    }

    .example-form {
      min-width: 150px;
      max-width: 500px;
      width: 100%;
    }

    .example-full-width {
      width: 100%;
    }
  `]
})
export class FilePreviewOverlayComponent { }
