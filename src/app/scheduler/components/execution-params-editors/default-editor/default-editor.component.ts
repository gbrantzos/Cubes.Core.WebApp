import { Component, OnInit, Input } from '@angular/core';
import { ParametersEditor } from '../execution-params-editors';

@Component({
  selector: 'cubes-default-editor',
  templateUrl: './default-editor.component.html',
  styleUrls: ['./default-editor.component.scss', '../common-styles.scss']
})
export class DefaultEditorComponent implements OnInit, ParametersEditor {
  @Input() parameters: string;

  constructor() { }
  ngOnInit() { }

  getParameters(): string {
    return this.parameters;
  }
}
