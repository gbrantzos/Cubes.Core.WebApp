import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Schema, SchemaService, CoreSchemas } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { Query, DataAccessStore } from '@features/data-access/services/data-access.store';
import { DialogService } from '@shared/services/dialog.service';
import { map } from 'rxjs/operators';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';

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
    private schemaService: SchemaService
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
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.DataQueries);
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
  onExecute() { }

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
}
