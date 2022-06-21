import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {RequestPasswordResetComponent} from "../request-password-reset/request-password-reset.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signInForm!: FormGroup;
  hidePassword = true;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {

    this.signInForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin(){
    this.authService.login(this.signInForm.value);
  }

  openForgotPasswordReset() {
    this.dialog.open(RequestPasswordResetComponent, {
      data: this.signInForm.get('email')?.value
    })
  }
}
