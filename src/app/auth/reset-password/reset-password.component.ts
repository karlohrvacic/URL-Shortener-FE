import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: UntypedFormGroup;
  token!: string;
  hidePassword: boolean = true;
  hidePasswordRepeat: boolean = true;

  constructor(private route: ActivatedRoute, private location: Location, private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });

    this.resetPasswordForm = new UntypedFormGroup({
      'token': new UntypedFormControl(this.token, [Validators.required]),
      'email': new UntypedFormControl(null, [Validators.required, Validators.email]),
      'password': new UntypedFormControl(null, [Validators.required, Validators.minLength(8)]),
      'password-repeat': new UntypedFormControl(null, [Validators.required, Validators.minLength(8)])
    });

    const url = this.router.createUrlTree([], {relativeTo: this.route, queryParams: {}}).toString()

    this.location.go(url);
  }

  resetPassword() {
    if (this.resetPasswordForm.value['password'] === this.resetPasswordForm.value['password-repeat']) {
      this.resetPasswordForm.get(['password-repeat'])?.reset()
      this.resetPasswordForm.removeControl('password-repeat');
      this.authService.changePassword(this.resetPasswordForm.value);
    }
    else {
      this.resetPasswordForm.addControl('password-repeat', new UntypedFormControl( '',[Validators.required]));
      this.toastr.error('Passwords must match!');
    }
  }

  getEmailError() {
    let email = this.resetPasswordForm.get('email');

    if (email?.hasError('required')) {
      return 'You must enter an email';
    }

    return email?.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordError() {
    let password = this.resetPasswordForm.get('password');

    if (password?.hasError('required')) {
      return 'You must enter a password';
    }

    return password?.hasError('minlength') ? 'Password needs to be at least 8 characters long' : '';
  }

  getRepeatPasswordError() {
    let repeatPassword = this.resetPasswordForm.get('password-repeat');

    if (repeatPassword?.hasError('required')) {
      return 'You need to repeat password';
    }
    if (repeatPassword?.hasError('minlength')) {
      return 'Password needs to be at least 8 characters long';
    }
    return repeatPassword?.value != this.resetPasswordForm.get('password')?.value ? 'Passwords need to match' : '';

  }

}
