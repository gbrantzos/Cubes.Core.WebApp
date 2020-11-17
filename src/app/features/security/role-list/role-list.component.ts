import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Role } from '@features/security/services/security.model';
import { SecurityStore } from '@features/security/services/security.store';
import { DynamicListComponent } from '@shared/components/dynamic-list/dynamic-list.component';
import { ListDefinition, Schema } from '@shared/services/schema.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy {
  @ViewChild('roles') roles: DynamicListComponent;
  public listDefinition: ListDefinition = {
    item: 'description',
    itemSub: 'code',
    iconSet: 'fas',
    iconName: 'fa-user-tag',
    disableDelete: 'isSystem',
    saveButton: true
  };
  public editorSchema: Schema = {
    name: 'roles',
    label: 'Roles Editor',
    items: [
      {key: 'description', label: 'Description', type: 'text', validators: [{name: 'required'}]},
      {key: 'code', label: 'Code', type: 'text', validators: [{name: 'required'}]}
    ]
  };
  private subs = new SubSink();

  constructor(private store: SecurityStore) { }

  ngOnInit(): void {
    this.subs.sink = this.store.roles.subscribe((data) => this.roles?.setModel(data ?? []));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  saveRoles(data: Role[]) {
    this.store.saveRoles(data);
  }
}
