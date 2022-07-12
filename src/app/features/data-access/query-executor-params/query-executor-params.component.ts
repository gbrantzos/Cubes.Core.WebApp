import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cubes-query-executor-params',
  templateUrl: './query-executor-params.component.html',
  styleUrls: ['./query-executor-params.component.scss'],
})
export class QueryExecutorParamsComponent implements OnInit {
  public queryName: string;
  public queryParameters: any[];
  public form: FormGroup;
  public get paramsArray() {
    return this.form.get('params') as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<QueryExecutorParamsComponent>,
    private fb: FormBuilder
  ) {
    this.queryName = data.queryName;
    this.queryParameters = data.parameters;
  }

  ngOnInit(): void {
    let lastValues = [];
    const temp = sessionStorage.getItem(`lastValues.${this.queryName}`);
    if (temp) {
      lastValues = JSON.parse(temp); console.log(lastValues);
    }
    const paramsArray = this.fb.array([]);
    this.form = this.fb.group({ params: paramsArray });
    this.queryParameters.forEach((prm) => {
      const lastValue = lastValues.find(i => i.name === prm.name);
      prm.value = lastValue ? lastValue['value'] : prm.default;
      prm.isNull = false;

      const row = this.fb.control({
        name: prm.name,
        value: [prm.value, Validators.required],
      });
      paramsArray.push(row);
    });
  }

  toggleNull(prm: any, index: number) {
    prm.isNull = !prm.isNull;
    if (prm.isNull) {
      prm.value = undefined;
      this.paramsArray.at(index).patchValue({ value: '(null)' });
    } else {
      prm.value = prm.default;
      this.paramsArray.at(index).patchValue({ value: prm.value });
    }
  }

  onExecute() {
    const result = this.queryParameters.map((p, i) => {
      const val = p.isNull ? undefined : this.paramsArray.at(i).value['value'];
      return { name: p.name, value: val };
    });
    sessionStorage.setItem(`lastValues.${this.queryName}`, JSON.stringify(result));
    this.dialogRef.close(result);
  }
}
