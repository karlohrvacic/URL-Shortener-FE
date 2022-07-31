import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: UntypedFormGroup;
  hidePassword: boolean = true;
  hidePasswordRepeat: boolean = true;

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.registerForm = new UntypedFormGroup({
      'email': new UntypedFormControl(null, [Validators.required, Validators.email]),
      'name': new UntypedFormControl(null, [Validators.required]),
      'password': new UntypedFormControl(null, [Validators.required, Validators.minLength(8)]),
      'password-repeat': new UntypedFormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  register() {
    if (this.registerForm.value['password'] === this.registerForm.value['password-repeat'] ){
      this.registerForm.removeControl('password-repeat');
      this.authService.register(this.registerForm.value);
    }
    else {
      this.registerForm.addControl('password-repeat',new UntypedFormControl( '',[Validators.required]));
      this.toastr.error('Passwords must match!');
    }
   }

  getEmailError() {
    let email = this.registerForm.get('email');

    if (email?.hasError('required')) {
      return 'You must enter an email';
    }

    return email?.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordError() {
    let password = this.registerForm.get('password');

    if (password?.hasError('required')) {
      return 'You must enter a password';
    }

    return password?.hasError('minlength') ? 'Password needs to be at least 8 characters long' : '';
  }

  getRepeatPasswordError() {
    let repeatPassword = this.registerForm.get('password-repeat');

    if (repeatPassword?.hasError('required')) {
      return 'You need to repeat password';
    }
    if (repeatPassword?.hasError('minlength')) {
      return 'Password needs to be at least 8 characters long';
    }
      return repeatPassword?.value != this.registerForm.get('password')?.value ? 'Passwords need to match' : '';
  }

}
