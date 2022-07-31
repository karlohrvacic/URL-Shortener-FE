import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/User";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ApiKeyService} from "../../shared/services/api-key.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../shared/services/auth.service";
import {ProfileViewComponent} from "../profile-view/profile-view.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  user!: User | undefined;
  passwordChangeForm!: UntypedFormGroup;
  hidePassword = true;
  hideOldPassword = true;
  hidePasswordRepeat = true;

  constructor(private apiKeyService: ApiKeyService, private toastr: ToastrService, private userService: UserService,
              private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = this.authService.user;

    this.passwordChangeForm = new UntypedFormGroup({
      'oldPassword': new UntypedFormControl(null, [Validators.required]),
      'newPassword': new UntypedFormControl(null, [Validators.required, Validators.minLength(8)]),
      'password-repeat': new UntypedFormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  changePassword() {
    if (this.passwordChangeForm.value['newPassword'] === this.passwordChangeForm.value['password-repeat'] ){
      this.passwordChangeForm.removeControl('password-repeat');
      this.userService.updatePassword(this.passwordChangeForm.value);
      this.dialog.closeAll()
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

  openUserProfileInfo() {
    this.dialog.open(ProfileViewComponent, {
      data: this.user
    })
  }

}
