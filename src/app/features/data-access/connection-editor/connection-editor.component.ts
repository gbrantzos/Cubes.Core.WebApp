import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SchemaService, CoreSchemas, Schema } from '@shared/services/schema.service';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-connection-editor',
  templateUrl: './connection-editor.component.html',
  styleUrls: ['./connection-editor.component.scss', '../data-access.common.editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;
  @Output() testConnection = new EventEmitter<Connection>();

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
    const connection = this.connectionFromForm();
    this.testConnection.emit(connection);
  }
  onDelete() {
    if (this.isNew) {
      this.dialogService
        .confirm('Discard new connection?')
        .subscribe(r => {
          if (r) { this.store.discardNewConnection(); }
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
    const connection = this.connectionFromForm();
    this.store.saveConnection(this.originalName, connection);
    this.form.markAsPristine();
    this.isNew = false;
  }

  pendingChanges(): boolean { return this.form ? !this.form.pristine : false; }

  private connectionFromForm(): Connection {
    const currentValue: any = this.form.currentValue();
    return {
      id: this.originalId,
      name: currentValue.name,
      comments: currentValue.comments,
      connectionString: currentValue.connectionString,
      dbProvider: currentValue.dbProvider,
      isNew: false
    };
  }

}
