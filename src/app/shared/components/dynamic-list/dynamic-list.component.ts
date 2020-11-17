import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicListEditorComponent } from '@shared/components/dynamic-list-editor/dynamic-list-editor.component';
import { DialogService } from '@shared/services/dialog.service';
import { ListDefinition, Schema } from '@shared/services/schema.service';

@Component({
  selector: 'cubes-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss'],
})
export class DynamicListComponent implements OnInit {
  @Input() editorSchema: Schema;
  @Input() model: any[] = [];
  @Input() listDefinition: ListDefinition;
  @Input() label: string;
  @Output() save = new EventEmitter<any[]>();

  public selectedItem: any;
  public get dirty() {
    return this._dirty;
  }

  private _dirty = false;

  constructor(private dialogService: DialogService, private matDialog: MatDialog) {}

  ngOnInit(): void {}

  public setModel(model: any[], leaveDirty = false) {
    const sortKey = this.listDefinition.item;
    this.model = (model || []).sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
    this._dirty = false;
  }

  addItem() {
    const newItem = {};
    newItem[this.listDefinition.item] = `${this.label} - Item.#${this.model.length + 1}`;
    this.editItem(newItem);
  }

  editItem(m: any) {
    this.matDialog
      .open(DynamicListEditorComponent, {
        minWidth: '460px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          label:  this.label,
          schema: this.editorSchema,
          model:  this.clone(m),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        const sortKey = this.listDefinition.item;
        if (result) {
          this.model = [...this.model.filter((item) => item !== m), result]
            .sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
          this.selectedItem = result;
          this._dirty = true;
        }
      });
  }

  async removeItem(m: any) {
    const dialogResult = await this.dialogService
      .confirm(`You are about to remove from list <b>${m[this.listDefinition.item]}</b>.\nContinue?`)
      .toPromise();
    if (!dialogResult) {
      return;
    }
    this.model = this.model.filter((item) => item !== m);
    this._dirty = true;
  }

  markAsPristine() {
    this._dirty = false;
  }

  onSave() {
    this.save.emit(this.model);
  }
  private clone(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }
}
