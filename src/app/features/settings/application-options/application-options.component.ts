import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ApplicationOptionsUIConfig,
  ApplicationOptionsService,
} from '@features/settings/services/application-options.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cubes-application-options',
  templateUrl: './application-options.component.html',
  styleUrls: ['./application-options.component.scss'],
})
export class ApplicationOptionsComponent implements OnInit {
  public appOptions$: Observable<ApplicationOptionsUIConfig[]>;
  public form: FormGroup;
  public current: ApplicationOptionsUIConfig;
  public selectedTab: number;

  @ViewChildren('sections') sections: QueryList<ElementRef>;

  constructor(
    private appConfigService: ApplicationOptionsService,
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

        this.appConfigService.getSettingsData(this.current.optionsTypeName).subscribe((data) => {
          const sections = this.sections.toArray();
          Object.keys(data).forEach((key, index) => {
            ((<any>sections[index]) as DynamicFormComponent).loadModel(data[key]);
          });
        });
      }
    });

    this.load();
  }

  load() {
    this.appOptions$ = this.appConfigService.getUIConfig().pipe(
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
      this.appConfigService.saveSettingsData(this.current.optionsTypeName, toReturn)
    );
    call$.subscribe(
      (data) => {
        this.dialogService.snackSuccess(data);
      },
      (error) => {
        console.error(error);
        const message = `Could not save application options!\n\n${error.error.message || error.message}`;
        this.dialogService.snackError(message);
      }
    );
  }

  onReload() {}
  onReset() {
    // TODO Check for changes
    const call$ = this.loadingWrapper.wrap(this.appConfigService.resetSettingsData(this.current.optionsTypeName));
    call$.subscribe(
      (data) => {
        this.dialogService.snackSuccess(data);
        this.load();
      },
      (error) => {
        console.error(error);
        const message = `Could not save application options!\n\n${error.error.message || error.message}`;
        this.dialogService.snackError(message);
      }
    );
  }
}
