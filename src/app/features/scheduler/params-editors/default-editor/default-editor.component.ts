import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ParametersEditor } from '@features/scheduler/params-editors/execution-params-editors';
import { JobParameters } from '@features/scheduler/services/scheduler.models';

@Component({
  selector: 'cubes-default-editor',
  templateUrl: './default-editor.component.html',
  styleUrls: ['./default-editor.component.scss', '../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultEditorComponent implements OnInit, ParametersEditor {
  public control = new FormControl();

  constructor() {}
  ngOnInit() {}

  getParameters(): JobParameters {
    const params: JobParameters = {};
    const lines = this.control.value?.split('\n');
    if (lines) {
      lines.forEach((line) => {
        const index = line.indexOf(':');
        if (index !== -1) {
          const key = line.substr(0, index).trim();
          const value = line.substr(index + 1).trim();
          params[key] = value;
        }
      });
    }
    return params;
  }
  setParameters(params: JobParameters) {
    let tmp = '';
    Object.keys(params).forEach((key) => {
      tmp += `${key}: ${params[key]}\n`;
    });
    this.control.setValue(tmp);
  }
  pendingChanges(): boolean {
    return !this.control.pristine;
  }
  markAsPristine() {
    this.control.markAsPristine();
  }
}
