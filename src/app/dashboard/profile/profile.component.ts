import { Component, OnInit } from '@angular/core';
import {ApiKeyService} from "../../shared/services/api-key.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User | undefined;
  passwordChangeForm!: FormGroup;

  constructor(private apiKeyService: ApiKeyService, private toastr: ToastrService, private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user;

    this.passwordChangeForm = new FormGroup({
      'oldPassword': new FormControl(null, [Validators.required]),
      'newPassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'repeat-new-password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  changePassword() {
      if (this.passwordChangeForm.value['newPassword'] === this.passwordChangeForm.value['repeat-new-password'] ){
        this.passwordChangeForm.removeControl('repeat-new-password');
        this.userService.updatePassword(this.passwordChangeForm.value);
      }
      else {
        this.passwordChangeForm.addControl('repeat-new-password',new FormControl( '',[Validators.required]));
        this.toastr.error('Passwords must match!');
      }
  }

}
