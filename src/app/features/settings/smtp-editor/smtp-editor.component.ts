import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { Observable } from 'rxjs';
import { SmtpProfile, SettingsStore } from '@features/settings/services/settings.store';
import { Schema, SchemaService, CoreSchemas } from '@shared/services/schema.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-smtp-editor',
  templateUrl: './smtp-editor.component.html',
  styleUrls: ['./smtp-editor.component.scss']
})
export class SmtpEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;

  public profile$: Observable<SmtpProfile>;
  public formSchema$: Observable<Schema>;
  public isNew = false;
  private originalName: string;
  constructor(
    private store: SettingsStore,
    private schemaService: SchemaService
  ) { }

  ngOnInit(): void {
    this.profile$ = this.store
      .selectedSmtpProfile
      .pipe(
        map(qry => {
          this.originalName = qry?.name;
          this.isNew = qry?.isNew ?? false;
          return qry;
        })
      );
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.SettingsSMTP);
  }

  onDelete() { }
  onSave() { }
}
