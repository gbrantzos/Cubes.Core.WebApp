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
        validators: {
          required: true
        }
      }, {
        key: 'host',
        label: 'Host',
        type: 'text',
      }, {
        key: 'port',
        label: 'Port',
        type: 'text',
      }, {
        key: 'options',
        label: 'Options',
        type: 'select',
        options: {
          optionItems: [
            { label: '(choose one)', value: '' },
            { label: 'Bolzano', value: '39100' },
            { label: 'Meltina', value: '39010', disabled: true },
            { label: 'Appiano', value: '39057' }
          ],
          multipleOptions: true
        }
      }, {
        key: 'sender',
        label: 'Sender',
        type: 'textarea',
        textareaRows: 4
      }, {
        key: 'validFrom',
        label: 'Valid from',
        type: 'datepicker'
      }, {
        key: 'timeout',
        label: 'Timeout',
        type: 'checkbox',
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
    validFrom: new Date()
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
      validFrom: new Date(2019, 5, 3)
    };
    form.setModel(model);
  }
}
