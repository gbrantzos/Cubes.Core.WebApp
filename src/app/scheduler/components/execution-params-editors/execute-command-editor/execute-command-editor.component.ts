import { Component, OnInit, Input } from '@angular/core';
import { Lookup } from 'src/app/core/services/lookup.service';
import { ParametersEditor } from '../execution-params-editors';

@Component({
  selector: 'cubes-execute-command-editor',
  templateUrl: './execute-command-editor.component.html',
  styleUrls: ['./execute-command-editor.component.scss', '../common-styles.scss']
})
export class ExecuteCommandEditorComponent implements OnInit, ParametersEditor {
  @Input() parameters: string;
  @Input() commandsLookup: Lookup;

  constructor() { }
  ngOnInit() { }

  getParameters(): string {
    return this.parameters;
  }
}
