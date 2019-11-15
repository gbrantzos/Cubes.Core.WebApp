import { Component, OnInit, Input } from '@angular/core';
import { Connection } from '@src/app/core/services/settings.service';
import { Schema } from '@src/app/shared/services/schema.service';

@Component({
  selector: 'cubes-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {
  @Input() model: Connection[];
  @Input() schema: Schema;

  constructor() { }
  ngOnInit() { }

}
