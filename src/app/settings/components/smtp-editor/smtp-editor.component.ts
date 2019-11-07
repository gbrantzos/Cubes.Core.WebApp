import { Component, OnInit, Input, Injectable, Output, EventEmitter, ViewChild } from '@angular/core';
import { Schema } from '@src/app/shared/services/form-schema.service';
import { SmtpSettings } from '@src/app/core/services/settings.service';
import { DynamicForm } from '@src/app/shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'cubes-smtp-editor',
  templateUrl: './smtp-editor.component.html',
  styleUrls: ['./smtp-editor.component.scss']
})
export class SmtpEditorComponent implements OnInit {
  @Input() schema: Schema;
  @Input() model: any;

  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  @ViewChild('f', {static: false}) f: DynamicForm;

  constructor() { }
  ngOnInit() { }

  onSave(model: any) { this.save.emit(model); }
  onDelete(profile: string) { this.save.emit(profile); }

  public setModel(model: SmtpSettings) {
    this.f.setModel(model);
    this.model = model;
  }
}
