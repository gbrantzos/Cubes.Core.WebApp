import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ApplicationSettingsUIConfig,
  ApplicationsSettingsService,
} from '@features/settings/services/applications-settings.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-application-settings',
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.scss'],
})
export class ApplicationSettingsComponent implements OnInit {
  public appSettings$: Observable<ApplicationSettingsUIConfig[]>;
  public form: FormGroup;
  public current: ApplicationSettingsUIConfig;
  public selectedTab: number;

  @ViewChildren('sections') sections: QueryList<ElementRef>;

  constructor(
    private appConfigService: ApplicationsSettingsService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private loadingWrapper: LoadingWrapperService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      appSelector: new FormControl(),
    });
    this.form.valueChanges.subscribe((v) => {
      if (v.appSelector) {
        this.current = v.appSelector;
        this.selectedTab = 0;

        this.appConfigService.getSettingsData(this.current.settingsTypeName).subscribe((data) => {
          const sections = this.sections.toArray();
          Object.keys(data).forEach((key, index) => {
            ((<any>sections[index]) as DynamicFormComponent).loadModel(data[key]);
          });
        });
      }
    });

    this.appSettings$ = this.appConfigService.getUIConfig().pipe(
      map((data) => {
        if (data && data.length >= 1) {
          this.form.get('appSelector').setValue(data[0]);
        }
        return data;
      })
    );
  }

  onSave() {
    const toReturn = {};
    const sections = this.sections.toArray();

    sections.forEach((s, i) => {
      const rootProperty = this.current.uiSchema.sections[i].rootProperty;
      const sectionValue = ((<any>s) as DynamicFormComponent).form.value;

      toReturn[rootProperty] = sectionValue;
    });

    const call$ = this.loadingWrapper.wrap(
      this.appConfigService.saveSettingsData(this.current.settingsTypeName, toReturn)
    );
    call$.subscribe(
      (data) => {
        this.dialogService.snackSuccess(data);
      },
      (error) => {
        console.error(error);
        const message = `Could not save settings!\n\n${error.error.message || error.message}`;
        this.dialogService.snackError(message);
      }
    );
  }

  onReload() {}
  onReset() {}
}
