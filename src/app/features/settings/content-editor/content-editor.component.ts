import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { StaticContent } from '@features/settings/services/content.model';
import { ContentStore } from '@features/settings/services/content.store';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DialogService } from '@shared/services/dialog.service';
import { CoreSchemas, Schema, SchemaService } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;

  public content$: Observable<StaticContent>;
  public formSchema$: Observable<Schema>;
  public isNew = false;

  private originalRequestPath: string;

  constructor(
    private store: ContentStore,
    private schemaService: SchemaService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.content$ = this.store.selectedContent.pipe(
      map((content) => {
        this.originalRequestPath = content?.requestPath;
        this.isNew = content?.isNew ?? false;
        return content;
      })
    );
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.StaticContent);
  }

  pendingChanges(): boolean {
    return this.form ? !this.form.pristine : false;
  }

  onDelete() {
    if (this.isNew) {
      this.dialogService.confirm('Discard new static content?').subscribe((r) => {
        if (r) {
          this.store.discardNewContent();
        }
      });
    } else {
      this.dialogService.confirm('Delete current static content?').subscribe((r) => {
        if (r) {
          this.store.deleteContent(this.originalRequestPath);
        }
      });
    }
  }

  async onSave() {
    const content = this.contentFromForm();
    const existing = this.store.snapshot.find((s) => s.requestPath === content.requestPath);
    const willOverwrite = this.isNew ? existing : existing && existing.requestPath !== this.originalRequestPath;
    if (willOverwrite) {
      const dialogResult = await this.dialogService
        .confirm(`Static Content with request path '${content.requestPath}' already exist.\nContinue and overwrite?`)
        .toPromise();
      if (!dialogResult) {
        return;
      }
      this.originalRequestPath = content.requestPath;
    }
    this.store.saveContent(this.originalRequestPath, content);
    this.form.markAsPristine();
    this.isNew = false;
  }

  private contentFromForm(): StaticContent {
    const currentValue: any = this.form.currentValue();
    return {
      requestPath: currentValue.requestPath,
      fileSystemPath: currentValue.fileSystemPath,
      defaultFile: currentValue.defaultFile,
      active: currentValue.active,
      serveUnknownFileTypes: currentValue.serveUnknownFileTypes,
      customContentTypes: currentValue.customContentTypes,
      isNew: false,
    } as StaticContent;
  }
}
