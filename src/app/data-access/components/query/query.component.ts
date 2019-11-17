import { Component, OnInit, Input, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { Schema } from '@src/app/shared/services/schema.service';
import { Query } from '@src/app/core/services/settings.service';
import { MatExpansionPanel } from '@angular/material';
import { DialogService } from '@src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  @Input() model: Query[];
  @Input() schema: Schema;

  @Output() saveQueries = new EventEmitter<Query[]>();

  @ViewChildren(MatExpansionPanel) list: QueryList<MatExpansionPanel>;

  constructor(private dialogService: DialogService) { }
  ngOnInit() { }

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

  onExecute(query: Query) { console.log(`Executing query ${query.name}`); }
}
