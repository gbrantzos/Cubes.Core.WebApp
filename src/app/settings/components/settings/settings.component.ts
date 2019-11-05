import { Component, OnInit } from '@angular/core';
import { Schema } from '@src/app/shared/services/form-schema.service';
import { DynamicForm } from '@src/app/shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'cubes-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public isValid = false;
  public schema: Schema = {
    name: 'testingSchema',
    items: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        validators: [{ name: 'required'}]
      }, {
        key: 'host',
        label: 'Host',
        type: 'text'
      }, {
        key: 'port',
        label: 'Port',
        type: 'text',
        validators: [{ name: 'min', parameters: 25}]
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
        },
        validators: [{ name: 'required' }]
      }, {
        key: 'sender',
        label: 'Sender',
        type: 'textarea',
        textareaRows: 4,
        validators: [{ name: 'email'}]
      }, {
        key: 'timeout',
        label: 'Timeout',
        type: 'checkbox',
        validators: [{ name: 'requiredTrue'}]
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
    timeout: true,
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
    console.log(form);
  }
}
