import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiKeyService} from "../../shared/services/api-key.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  user!: User | undefined;
  passwordChangeForm!: FormGroup;
  hidePassword = true;
  hideOldPassword = true;
  hidePasswordRepeat = true;

  constructor(private apiKeyService: ApiKeyService, private toastr: ToastrService, private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user;

    this.passwordChangeForm = new FormGroup({
      'oldPassword': new FormControl(null, [Validators.required]),
      'newPassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'password-repeat': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  changePassword() {
    if (this.passwordChangeForm.value['newPassword'] === this.passwordChangeForm.value['repeat-new-password'] ){
      this.passwordChangeForm.removeControl('password-repeat');
      this.userService.updatePassword(this.passwordChangeForm.value);
    }
    else {
      this.toastr.error('Passwords must match!');
    }
  }

  getPasswordError() {
    let password = this.passwordChangeForm.get('password');

    if (password?.hasError('required')) {
      return 'You must enter a password';
    }

    return password?.hasError('minlength') ? 'Password needs to be at least 8 characters long' : '';
  }

  getRepeatPasswordError() {
    let repeatPassword = this.passwordChangeForm.get('password-repeat');

    if (repeatPassword?.hasError('required')) {
      return 'You need to repeat password';
    }
    if (repeatPassword?.hasError('minlength')) {
      return 'Password needs to be at least 8 characters long';
    }
    return repeatPassword?.value != this.passwordChangeForm.get('password')?.value ? 'Passwords need to match' : '';
  }

}
