import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { Observable, Subscription } from 'rxjs';
import { SchemaService, CoreSchemas } from '@shared/services/schema.service';

@Component({
  selector: 'cubes-connection-editor',
  templateUrl: './connection-editor.component.html',
  styleUrls: ['./connection-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionEditorComponent implements OnInit, OnDestroy {
  public connection$: Observable<Connection>;
  public formSchema: any;
  private schemaSub: Subscription;

  constructor(
    private store: DataAccessStore,
    private schemaService: SchemaService
  ) { }
  ngOnInit(): void {
    this.connection$ = this.store.selectedConnection;
    this.schemaSub = this.schemaService
      .getSchema(CoreSchemas.DataConnection)
      .subscribe(schema => this.formSchema = schema);
  }
  ngOnDestroy(): void {
    if (this.schemaSub) {
      this.schemaSub.unsubscribe();
    }
  }
}
