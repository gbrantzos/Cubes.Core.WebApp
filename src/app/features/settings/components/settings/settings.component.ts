import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { Observable, forkJoin, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SmtpEditorComponent } from '@features/settings/components/smtp-editor/smtp-editor.component';
import { DialogService } from '@shared/services/dialog.service';
import { SchemaService, CoreSchemas } from '@shared/services/schema.service';
import { SmtpSettings, SettingsService } from '@core/services/settings.service';


@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @HostBinding('class') class = 'base-component';
  @ViewChild('editor') editor: SmtpEditorComponent;

  public data$: Observable<any>;
  public errorLoading = false;
  public errorMessage = '';

  private smtpProfiles: SmtpSettings[];

  constructor(
    private settingsService: SettingsService,
    private schemaService: SchemaService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar) { }
  ngOnInit() { this.loadData(); }

  private resetError() {
    this.errorLoading = false;
    this.errorMessage = '';
  }

  public loadData() {
    this.resetError();
    this.smtpProfiles = [];
    this.data$ = forkJoin(
      this.schemaService.getSchema(CoreSchemas.SettingsSMTP),
      this.settingsService.getSmtp(),
    ).pipe(
      map(([schema, model]) => {
        this.smtpProfiles = model || [];
        const profiles = (model as SmtpSettings[]).map(a => a.name);
        return {
          schema,
          model,
          profiles
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

  onSave(editorArgs: any) {
    const currentValue = editorArgs.model as SmtpSettings;
    const originalName = editorArgs.originalName as string;

    const existing = this.smtpProfiles.find(s => s.name === originalName);
    if (!existing) {
      this.smtpProfiles.push(currentValue);
    } else {
      Object.assign(existing, currentValue);
    }
    this.saveSettings();
  }

  private saveSettings() {
    this.settingsService
      .saveSmtp(this.smtpProfiles)
      .subscribe(result => {
        this.displayMessage(result || 'SMTP settings saved!');
        this.loadData();
      });
  }
  onDelete(profile: string) {
    this.dialogService
      .confirm('You are about to delete SMTP profile <strong>' + profile + '</strong>!<br>Continue?')
      .subscribe(resultOk => {
        if (resultOk) {
          const toDelete = this.smtpProfiles.find(s => s.name === profile);
          this.smtpProfiles.splice(this.smtpProfiles.indexOf(toDelete), 1);
          setTimeout(() => this.saveSettings());
        }
      });
  }

  onSelect(profile: string) {
    let model = this.smtpProfiles.find(s => s.name === profile);
    if (profile === 'NEW') {
      model = {
        name: 'NEW',
        host: 'localhost',
        port: 25,
        sender: 'nobody@somewhere.com',
        timeout: 300,
        useSsl: false
      };
    }
    setTimeout(() => this.editor.setModel(model));
  }

  private displayMessage(message: string) {
    const snackRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
