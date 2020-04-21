import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QueryExecutorComponent } from '@features/data-access/query-executor/query-executor.component';
import { DataAccessStore, Query } from '@features/data-access/services/data-access.store';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DialogService } from '@shared/services/dialog.service';
import { CoreSchemas, Schema, SchemaService } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss', '../data-access.common.editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;

  public query$: Observable<Query>;
  public formSchema$: Observable<Schema>;
  public isNew = false;
  public parametersForm: FormGroup;
  public queryParameters: any[];
  public dbType = DbType;
  public selectedIndex = 0;
  public get parameters() {
    return this.parametersForm.get('params') as FormArray;
  }

  private originalName: string;
  private originalId: number;

  constructor(
    private store: DataAccessStore,
    private dialogService: DialogService,
    private schemaService: SchemaService,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.query$ = this.store.selectedQuery.pipe(
      map((qry) => {
        this.form?.markAsPristine();
        this.parametersForm?.markAsPristine();

        this.originalName = qry?.name;
        this.originalId = qry?.id;
        this.queryParameters = qry?.parameters ? [...qry.parameters] : [];
        this.isNew = qry?.isNew ?? false;
        if (qry && qry.parameters) {
          this.parameters.clear();
          qry.parameters.forEach((r) => this.addParameter({ ...r }));
        }
        this.selectedIndex = 0;
        return qry;
      })
    );
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.DataQuery);
    this.parametersForm = this.fb.group({
      params: this.fb.array([]),
    });
  }

  public addParameter(prm: any) {
    if (!prm) {
      prm = {
        name: 'p_prm',
        dbType: 'String',
        default: '',
      };
      this.queryParameters.push(prm);
      this.parametersForm.markAsDirty();
    }
    const row = this.fb.group({
      name: [prm?.name || '', Validators.required],
      dbType: prm?.dbType || 'String',
      default: prm?.default || '',
    });
    this.parameters.push(row);
  }

  public removeParameter(i: number) {
    this.parameters.removeAt(i);
    this.queryParameters.splice(i, 1);
  }

  pendingChanges(): boolean {
    return this.form ? !this.form.pristine || !this.parametersForm.pristine : false;
  }

  onDelete() {
    if (this.isNew) {
      this.dialogService.confirm('Discard new query?').subscribe((r) => {
        if (r) {
          this.store.discardNewQuery();
        }
      });
    } else {
      this.dialogService.confirm('Delete current query?').subscribe((r) => {
        if (r) {
          this.store.deleteQuery(this.originalName);
        }
      });
    }
  }

  async onSave() {
    const query = this.queryFromForm();
    const existing = this.store.queriesSnapshot.find((s) => s.name === query.name);
    const willOverwrite = this.isNew ? existing : existing && existing.name !== this.originalName;
    if (willOverwrite) {
      const dialogResult = await this.dialogService
        .confirm(`Query with name '${query.name}' already exist.\nContinue and overwrite?`)
        .toPromise();
      if (!dialogResult) {
        return;
      }
      this.originalName = query.name;
    }
    this.store.saveQuery(this.originalName, query);
    this.form.markAsPristine();
    this.parametersForm.markAsPristine();
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
          connections: this.store.connectionsSnapshot.map((c) => c.name),
          selectedConnection: this.store.selectedConnectionValue,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (typeof result === 'string' && result !== query.queryCommand) {
          this.dialogService
            .confirm('Query command has changed. Update command on query <strong>' + query.name + '</strong>?')
            .subscribe((resultOk) => {
              if (resultOk) {
                this.form.loadModel({ queryCommand: result }, true);
              }
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
      parameters: this.parameters.getRawValue(),
      isNew: false,
    } as Query;
  }

  private clone(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }
}

const DbType = [
  'AnsiString',
  'Binary',
  'Byte',
  'Boolean',
  'Currency',
  'Date',
  'DateTime',
  'Decimal',
  'Double',
  'Guid',
  'Int16',
  'Int32',
  'Int64',
  'Object',
  'SByte',
  'Single',
  'String',
  'Time',
  'UInt16',
  'UInt32',
  'UInt64',
  'VarNumeric',
  'AnsiStringFixedLength',
  'StringFixedLength',
  'Xml',
  'DateTime2',
  'DateTimeOffset',
];
