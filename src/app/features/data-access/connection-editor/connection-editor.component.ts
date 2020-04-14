import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { Observable } from 'rxjs';
import { SchemaService, CoreSchemas, Schema } from '@shared/services/schema.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { map } from 'rxjs/operators';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-connection-editor',
  templateUrl: './connection-editor.component.html',
  styleUrls: ['./connection-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;

  public connection$: Observable<Connection>;
  public formSchema$: Observable<Schema>;
  public isNew = false;
  private originalName: string;
  private originalId: number;

  constructor(
    private store: DataAccessStore,
    private dialogService: DialogService,
    private schemaService: SchemaService
  ) { }
  ngOnInit(): void {
    this.connection$ = this.store
      .selectedConnection
      .pipe(
        map(cnx => {
          this.originalName = cnx?.name;
          this.originalId = cnx?.id;
          this.isNew = cnx?.isNew ?? false;
          return cnx;
        })
      );
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.DataConnection);
  }

  onTest() {
    // TODO Make call to API
    console.log('Testing');
  }
  onDelete() {
    if (this.isNew) {
      this.dialogService
        .confirm('Discard new connection?')
        .subscribe(r => {
          if (r) { this.store.discardNew(); }
        });
    } else {
      this.dialogService
        .confirm('Delete current connection?')
        .subscribe(r => {
          if (r) { this.store.deleteConnection(this.originalName); }
        });
    }
  }
  onSave() {
    const currentValue: any = this.form.currentValue();
    const connection: Connection = {
      id: this.originalId,
      name: currentValue.name,
      comments: currentValue.comments,
      connectionString: currentValue.connectionString,
      dbProvider: currentValue.dbProvider
    };
    this.form.markAsPristine();
    this.store.saveConnection(this.originalName, connection);
  }

  pendingChanges(): boolean { return this.form ? !this.form.pristine : false; }
}
