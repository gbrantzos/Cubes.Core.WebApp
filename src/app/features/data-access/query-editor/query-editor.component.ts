import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Schema, SchemaService, CoreSchemas } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { Query, DataAccessStore } from '@features/data-access/services/data-access.store';
import { DialogService } from '@shared/services/dialog.service';
import { map } from 'rxjs/operators';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { QueryExecutorComponent } from '@features/data-access/query-executor/query-executor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cubes-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss', '../data-access.common.editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;

  public query$: Observable<Query>;
  public formSchema$: Observable<Schema>;
  public isNew = false;
  private originalName: string;
  private originalId: number;
  private originalParameters: any[]; // TODO Currently editor does not support collection properties

  constructor(
    private store: DataAccessStore,
    private dialogService: DialogService,
    private schemaService: SchemaService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.query$ = this.store
      .selectedQuery
      .pipe(
        map(qry => {
          this.originalName = qry?.name;
          this.originalId = qry?.id;
          this.originalParameters = qry?.parameters ?? [];
          this.isNew = qry?.isNew ?? false;
          return qry;
        })
      );
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.DataQuery);
  }

  pendingChanges(): boolean { return this.form ? !this.form.pristine : false; }

  onDelete() {
    if (this.isNew) {
      this.dialogService
        .confirm('Discard new query?')
        .subscribe(r => {
          if (r) { this.store.discardNewQuery(); }
        });
    } else {
      this.dialogService
        .confirm('Delete current query?')
        .subscribe(r => {
          if (r) { this.store.deleteQuery(this.originalName); }
        });
    }
  }
  onSave() {
    const query = this.queryFromForm();
    this.store.saveQuery(this.originalName, query);
    this.form.markAsPristine();
    this.isNew = false;
  }
  onExecute() {
    const query = this.queryFromForm();
    this.matDialog
      .open(QueryExecutorComponent, {
        panelClass: 'full-width-dialog',
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        minHeight: '100vh',
        hasBackdrop: true,
        disableClose: true,
        data: {
          query: this.clone(query),
          connections: this.store.connectionsValue,
          selectedConnection: this.store.selectedConnectionValue
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (typeof result === 'string' && result !== query.queryCommand) {
          this.dialogService
            .confirm('Query command has changed. Update command on query <strong>' + query.name + '</strong>?')
            .subscribe(resultOk => {
              if (resultOk) { this.form.loadModel({ queryCommand: result }, true); }
            });
        }
      });
  }

  private queryFromForm(): Query {
    const currentValue: any = this.form.currentValue();
    return {
      id: this.originalId,
      name: currentValue.name,
      comments: currentValue.comments,
      queryCommand: currentValue.queryCommand,
      parameters: this.originalParameters,
      isNew: false
    } as Query;
  }

  private clone(object: any): any { return (JSON.parse(JSON.stringify(object))); }
}
