import { Component, OnInit, Input, Injectable, Output, EventEmitter, ViewChild } from '@angular/core';
import { Schema } from '@src/app/shared/services/schema.service';
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

  private originalName = '';
  public isNew = false;

  @ViewChild('f', {static: false}) f: DynamicForm;

  constructor() { }
  ngOnInit() { }

  onSave(model: any) { this.save.emit({ model, originalName: this.originalName}); }
  onDelete(profile: SmtpSettings) { this.delete.emit(profile.name); }

  public setModel(model: SmtpSettings) {
    this.isNew = model.name === 'NEW';
    if (model.name === 'NEW') { model.name = 'New profile'; }
    this.originalName = model.name;
    this.f.setModel(model);
    this.model = model;
  }
}
