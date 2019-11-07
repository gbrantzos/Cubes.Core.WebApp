import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { FormSchemaService } from '@src/app/shared/services/form-schema.service';
import { SettingsService, SmtpSettings } from '@src/app/core/services/settings.service';
import { Observable, forkJoin, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SmtpEditorComponent } from '@src/app/settings/components/smtp-editor/smtp-editor.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @HostBinding('class') class = 'base-component';
  @ViewChild('editor', {static: false}) editor: SmtpEditorComponent;

  public data$: Observable<any>;
  public errorLoading = false;
  public errorMessage = '';

  private smtpProfiles: SmtpSettings[];

  constructor(
    private settingsService: SettingsService,
    private formSchemaService: FormSchemaService,
    private snackBar: MatSnackBar) { }
  ngOnInit() { this.loadData(); }

  public loadData() {
    this.data$ = forkJoin(
      this.formSchemaService.getSchema('smtp'),
      this.settingsService.getSmtp(),
    ).pipe(
      map(([schema, model]) => {
        const profiles =  (model as SmtpSettings[]) .map(a => a.name);
        this.smtpProfiles = model;
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

  // TODO
  onSave(currentValue: any) {
    console.log(currentValue);
  }

  // TODO
  onDelete(profile: string) {
    console.log(`Deleting profile ${profile}`);
  }

  onSelect(profile: string) {
    let model = this.smtpProfiles.find(s => s.name === profile);
    if (profile === 'NEW') {
      model = {
        name: 'New model',
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
      duration: 10000,
      panelClass: 'snack-bar',
      horizontalPosition: 'right'
    });
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
