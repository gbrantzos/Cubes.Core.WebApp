import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Connection } from '@src/app/core/services/settings.service';
import { Schema } from '@src/app/shared/services/schema.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DialogService } from '@src/app/shared/services/dialog.service';

@Component({
  selector: 'cubes-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit, AfterViewInit {
  @Input() model: Connection[];
  @Input() schema: Schema;
  @Input() selected = '--NONE--';
  @Output() saveConnections = new EventEmitter<Connection[]>();
  @Output() testConnection = new EventEmitter<Connection>();
  @Output() selectionChanged = new EventEmitter<string>();

  @ViewChildren(MatExpansionPanel) list: QueryList<MatExpansionPanel>;

  public connections: any[] = Array.of();

  constructor(private dialogService: DialogService) { }
  ngOnInit() { }
  ngAfterViewInit(): void {
    const listElements = this.list.toArray();
    if (listElements.length === 0) { return; }

    let selected: MatExpansionPanel;
    for (const el of listElements) {
      if (el.id === this.connections[this.selected]) {
        selected = el;
        break;
      }
    }
    if (!selected) { selected = listElements[0]; }
    setTimeout(() => selected.open());
  }
  mapID(elementID: string, connectionName: string) { this.connections[connectionName] = elementID; }

  onNewConnection() {
    const maxID = Math.max(...this.model.map(m => m.id), 0) + 1;
    this.model.push({
      id: maxID,
      name: `Connection.#${maxID}`,
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
      this.raiseSelectionChanged(connection.name);
    }
  }

  onSave() { this.saveConnections.next(this.model); }
  onDelete(connection: Connection) {
    this.dialogService
      .confirm('You are about to delete connection <strong>' + connection.name + '</strong>!<br>Continue?')
      .subscribe(resultOk => {
        if (resultOk) {
          const toDelete = this.model.find(c => c.id === connection.id);
          this.model.splice(this.model.indexOf(toDelete), 1);
          setTimeout(() => this.onSave());
        }
      });
  }
  onTest(connection: Connection) { this.testConnection.next(connection); }
  onSelectionChanged(connection) { this.raiseSelectionChanged(connection); }

  private raiseSelectionChanged(connection: string) { setTimeout(() => this.selectionChanged.next(connection)); }
}
