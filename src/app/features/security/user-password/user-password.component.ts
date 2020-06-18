import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomValidators } from '@core/helpers/custom-validators';

@Component({
  selector: 'cubes-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss'],
})
export class UserPasswordComponent implements OnInit {
  public user: string;
  public form: FormGroup;
  public hidePassword = true;
  public hideConfirm = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<UserPasswordComponent>,
    private formBuilder: FormBuilder
  ) {
    this.user = data.user;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirm: ['', Validators.required],
      },
      {
        validator: CustomValidators.mustMatch('password', 'confirm'),
      }
    );
  }
  accept() {
    this.dialogRef.close(this.form.get('password').value);
  }
}
