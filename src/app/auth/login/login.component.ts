import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {RequestPasswordResetComponent} from "../request-password-reset/request-password-reset.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signInForm!: UntypedFormGroup;
  hidePassword = true;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {

    this.signInForm = new UntypedFormGroup({
      'email': new UntypedFormControl(null, [Validators.required, Validators.email]),
      'password': new UntypedFormControl(null, Validators.required)
    });
  }

  onLogin() {
    this.authService.login(this.signInForm.value);
  }

  openForgotPasswordReset() {
    this.dialog.open(RequestPasswordResetComponent, {
      data: this.signInForm.get('email')?.value
    })
  }

}
