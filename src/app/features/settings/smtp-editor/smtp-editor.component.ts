import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsStore, SmtpProfile } from '@features/settings/services/settings.store';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DialogService } from '@shared/services/dialog.service';
import { CoreSchemas, Schema, SchemaService } from '@shared/services/schema.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-smtp-editor',
  templateUrl: './smtp-editor.component.html',
  styleUrls: ['./smtp-editor.component.scss'],
})
export class SmtpEditorComponent implements OnInit {
  @ViewChild('f', { static: false }) form: DynamicFormComponent;

  public profile$: Observable<SmtpProfile>;
  public formSchema$: Observable<Schema>;
  public isNew = false;
  private originalName: string;
  constructor(
    private store: SettingsStore,
    private schemaService: SchemaService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.store.selectedSmtpProfile.pipe(
      map((smtp) => {
        this.originalName = smtp?.name;
        this.isNew = smtp?.isNew ?? false;
        return smtp;
      })
    );
    this.formSchema$ = this.schemaService.getSchema(CoreSchemas.SettingsSMTP);
  }

  onDelete() {
    if (this.isNew) {
      this.dialogService.confirm('Discard new profile?').subscribe((r) => {
        if (r) {
          this.store.discardNewProfile();
        }
      });
    } else {
      this.dialogService.confirm('Delete current profile?').subscribe((r) => {
        if (r) {
          this.store.deleteProfile(this.originalName);
        }
      });
    }
  }

  async onSave() {
    const profile = this.profileFromForm();
    const existing = this.store.snapshot.find((s) => s.name === profile.name);
    const willOverwrite = this.isNew ? existing : existing && existing.name !== this.originalName;
    if (willOverwrite) {
      const dialogResult = await this.dialogService
        .confirm(`Profile with name '${profile.name}' already exist.\nContinue and overwrite?`)
        .toPromise();
      if (!dialogResult) {
        return;
      }
      this.originalName = profile.name;
    }
    this.store.saveProfile(this.originalName, profile);
    this.form.markAsPristine();
    this.isNew = false;
  }

  pendingChanges(): boolean {
    return this.form ? !this.form.pristine : false;
  }

  private profileFromForm(): SmtpProfile {
    const currentValue: any = this.form.currentValue();
    return {
      name: currentValue.name,
      comments: currentValue.comments,
      host: currentValue.host,
      port: Number(currentValue.port),
      timeout: Number(currentValue.timeout),
      sender: currentValue.sender,
      useSsl: !!currentValue.useSsl,
      userName: currentValue.userName,
      password: currentValue.password,
      isNew: false,
    } as SmtpProfile;
  }
}
