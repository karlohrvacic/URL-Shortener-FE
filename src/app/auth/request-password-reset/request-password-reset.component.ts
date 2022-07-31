import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css']
})
export class RequestPasswordResetComponent implements OnInit {

  constructor(private authService: AuthService, public dialogRef: MatDialogRef<RequestPasswordResetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  requestPasswordResetForm!: UntypedFormGroup;

  ngOnInit() {
    this.requestPasswordResetForm = new UntypedFormGroup({
      'email': new UntypedFormControl(this.data, [Validators.required, Validators.email]),
    });
  }

  onSend() {
    this.authService.requestPasswordChange(this.requestPasswordResetForm.value);
  }

  getEmailError() {
    let email = this.requestPasswordResetForm.get('email');

    if (email?.hasError('required')) {
      return 'You must enter an email';
    }

    return email?.hasError('email') ? 'Not a valid email' : '';
  }

}
