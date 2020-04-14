import { Component, OnInit, ViewChild } from '@angular/core';
import { DataAccessStore, Connection } from '@features/data-access/services/data-access.store';
import { ConnectionEditorComponent } from '@features/data-access/connection-editor/connection-editor.component';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {
  @ViewChild('form') form: ConnectionEditorComponent;

  constructor(
    public store: DataAccessStore,
    private dialogService: DialogService) { }
  ngOnInit(): void { }

  reload() { this.store.load(); }
  connectionSelected(cnx: Connection) {
    if (this.form.pendingChanges()) {
      this.dialogService
        .confirm('There are unsaved changes on selected connection.\nDiscard and continue?')
        .subscribe(r => {
          if (r) { this.store.selectConnection(cnx.id); }
        });
    } else {
      this.store.selectConnection(cnx.id);
    }
  }
}
