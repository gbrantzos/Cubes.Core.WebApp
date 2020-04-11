import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cubes-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
  @Input() columns: ColumnDefinition[];
  @Input() displayedColumns: string[];
  @Input() data: any;
  @Input() tableClass: any;

  constructor() { }
  ngOnInit() { }
}

export interface ColumnDefinition {
  name: string;
  header: string;
  rowProperty: string;
  columnClass?: string;
  headerClass?: string;
}
