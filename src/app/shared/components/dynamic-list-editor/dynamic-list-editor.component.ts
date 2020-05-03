import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Schema } from '@shared/services/schema.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'cubes-dynamic-list-editor',
  templateUrl: './dynamic-list-editor.component.html',
  styleUrls: ['./dynamic-list-editor.component.scss'],
})
export class DynamicListEditorComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: DynamicFormComponent;
  public label: string;
  public schema: Schema;
  public model: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DynamicListEditorComponent>
  ) {
    this.label  = data.label;
    this.schema = data.schema;
    this.model  = data.model;
  }

  ngOnInit(): void {}

  accept() {
    const toReturn = this.editor.form.getRawValue();
    this.dialogRef.close(toReturn);
  }
}
