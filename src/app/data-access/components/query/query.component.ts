import { Component, OnInit, Input, EventEmitter, Output, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Schema } from '@src/app/shared/services/schema.service';
import { Query } from '@src/app/core/services/settings.service';
import { MatExpansionPanel } from '@angular/material';
import { DialogService } from '@src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit, AfterViewInit {
  @Input() model: Query[];
  @Input() schema: Schema;
  @Input() selected = '--NONE--';

  @Output() saveQueries = new EventEmitter<Query[]>();
  @Output() selectionChanged = new EventEmitter<string>();
  @Output() executeQuery = new EventEmitter<Query>();

  @ViewChildren(MatExpansionPanel) list: QueryList<MatExpansionPanel>;
  public queries: any[] = Array.of();

  constructor(private dialogService: DialogService) { }
  ngOnInit() { }
  ngAfterViewInit() {
    const listElements = this.list.toArray();
    if (listElements.length === 0) { return; }

    let selected: MatExpansionPanel;
    for (const el of listElements) {
      if (el.id === this.queries[this.selected]) {
        selected = el;
        break;
      }
    }
    if (!selected) { selected = listElements[0]; }
    setTimeout(() => selected.open());
  }
  mapID(elementID: string, queryName: string) { this.queries[queryName] = elementID; }

  onNewQuery() {
    const maxID = Math.max(...this.model.map(m => m.id), 0) + 1;
    this.model.push({
      id: maxID,
      name: `Query #${maxID}`,
      comments: 'This is a new query',
      queryCommand: '<<Enter here the SQL query>>',
      parameters: []
    } as Query);
    setTimeout(() => this.list.last.open());
  }

  onSave() { this.saveQueries.next(this.model); }

  onEditorChanges(model, index) {
    const query = model as Query;
    if (model) {
      Object.assign(this.model[index], query);
      this.raiseSelectionChanged(query.name);
    }
  }

  onDelete(query: Query) {
    this.dialogService
      .confirm('You are about to delete query <strong>' + query.name + '</strong>!<br>Continue?')
      .subscribe(resultOk => {
        if (resultOk) {
          const toDelete = this.model.find(c => c.id === query.id);
          this.model.splice(this.model.indexOf(toDelete), 1);
          setTimeout(() => this.onSave());
        }
      });
  }
  onExecute(query: Query) { this.executeQuery.next(query); }

  onSelectionChanged(query) { this.raiseSelectionChanged(query); }

  updateQueryCommand(id: number, queryCommand: string) {
    const index = this.model.findIndex(q => q.id === id);
    setTimeout(() => this.model[index].queryCommand = queryCommand);
  }
  private raiseSelectionChanged(query: string) { setTimeout(() => this.selectionChanged.next(query)); }
}
