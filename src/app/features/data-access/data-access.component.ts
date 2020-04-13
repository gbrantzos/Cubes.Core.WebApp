import { Component, OnInit } from '@angular/core';
import { DataAccessStore } from '@features/data-access/services/data-access.store';

@Component({
  selector: 'cubes-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.scss']
})
export class DataAccessComponent implements OnInit {

  constructor(public store: DataAccessStore) { }
  ngOnInit(): void { }

  reload() { this.store.load(); }
}
