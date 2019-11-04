import { Component, OnInit } from '@angular/core';
import { Schema } from '@src/app/shared/services/form-schema.service';
import { DynamicForm } from '@src/app/shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public schema: Schema = {
    name: 'testingSchema',
    items: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
      }, {
        key: 'host',
        label: 'Host',
        type: 'text',
      }, {
        key: 'port',
        label: 'Port',
        type: 'text',
      }, {
        key: 'timeout',
        label: 'Timeout',
        type: 'checkbox',
      }, {
        key: 'options',
        label: 'Options',
        type: 'select',
        options: [
          { label: '(choose one)', value: '' },
          { label: 'Bolzano', value: '39100' },
          { label: 'Meltina', value: '39010' },
          { label: 'Appiano', value: '39057' }
        ],
        multipleOptions: true
      }, {
        key: 'sender',
        label: 'Sender',
        type: 'textarea',
      }, {
        key: 'validFrom',
        label: 'Valid from',
        type: 'datepicker'
      }
    ]
  };
  public model = {
    name: 'Default',
    host: 'localhost',
    port: '25',
    timeout: 300,
    sender: 'no-reply@localhost',
    options: [],
    validFrom: new Date(2019, 11, 5)
  };

  constructor() { }
  ngOnInit() { }

  showCurrent(currentValue: any) {
    console.log(currentValue);
  }

  delete(currentValue, form: DynamicForm) {
    const model = {
      name: 'Default - 2',
      host: 'localhost',
      port: '2512',
      timeout: 3001,
      sender: 'no-reply@localhost',
      options: [],
      validFrom: new Date(2019, 6, 3)
    };
    form.setModel(model);
  }
}
