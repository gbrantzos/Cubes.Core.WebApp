import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ApplicationSettingsUIConfig,
  ApplicationsSettingsService,
} from '@features/settings/services/applications-settings.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
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
            // setTimeout(() => (<any>sections[index] as DynamicFormComponent).loadModel(data[key]), 0);
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
    const sections = this.sections.toArray();
    sections.forEach((s) => {
      console.log(((<any>s) as DynamicFormComponent).form.value);
    });
  }
  onReload() {}
  onReset() {}
}
