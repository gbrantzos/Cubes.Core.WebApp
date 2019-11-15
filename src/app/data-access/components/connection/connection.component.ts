import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { Connection } from '@src/app/core/services/settings.service';
import { Schema } from '@src/app/shared/services/schema.service';
import { MatExpansionPanel } from '@angular/material';
import { DialogService } from '@src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {
  @Input() model: Connection[];
  @Input() schema: Schema;
  @Output() saveConnections = new EventEmitter<Connection[]>();
  // @Output() test = new EventEmitter<Connection>();

  @ViewChildren(MatExpansionPanel) list: QueryList<MatExpansionPanel>;

  constructor(private dialogService: DialogService) { }
  ngOnInit() { }

  onNewConnection() {
    const maxID = Math.max(...this.model.map(m => m.id), 0) + 1;
    this.model.push({
      id: maxID,
      name: `Connection #${maxID}`,
      comments: 'This is a new connection',
      connectionString: '<<Enter here the connection string>>',
      dbProvider: 'mssql'
    });
    setTimeout(() => this.list.last.open());
  }

  onEditorChanges(model, index) {
    const connection = model as Connection;
    if (model) {
      Object.assign(this.model[index], connection);
    }
  }

  onSave() { this.saveConnections.next(this.model); console.log(this.model); }
  onDelete(connection: Connection) {
    this.dialogService
      .confirm('You are about to delete connection <strong>' + connection.name + '</strong>!<br>Continue?')
      .subscribe(resultOk => {
        if (resultOk) {
          const toDelete = this.model.find(c => c.id === connection.id);
          this.model.splice(this.model.indexOf(toDelete), 1);
          // setTimeout(() => this.saveSettings());
        }
      });
  }
  // onTest(connection: Connection) { this.test.next(connection); }
}
