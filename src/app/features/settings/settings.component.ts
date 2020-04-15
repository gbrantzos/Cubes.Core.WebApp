import { Component, OnInit } from '@angular/core';
import { SettingsStore } from '@features/settings/services/settings.store';

@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private store: SettingsStore) { }
  ngOnInit(): void { this.store.loadData(); }

  reload() { }
}
