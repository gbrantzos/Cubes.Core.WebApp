import { Component, OnInit, Input } from '@angular/core';
import { ParametersEditor } from '../execution-params-editors';
import { JobParameters } from 'src/app/core/services/scheduler.service';

@Component({
  selector: 'cubes-default-editor',
  templateUrl: './default-editor.component.html',
  styleUrls: ['./default-editor.component.scss', '../common-styles.scss']
})
export class DefaultEditorComponent implements OnInit, ParametersEditor {
  @Input() parameters: string;

  constructor() { }
  ngOnInit() { }

  getParameters(): JobParameters {
    // return this.parameters;
    // TODO Parse parameters!!!
    return { key: 'value'};
  }
}
