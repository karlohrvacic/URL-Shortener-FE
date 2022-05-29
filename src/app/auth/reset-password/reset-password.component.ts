import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  token!: string;
  constructor(private route: ActivatedRoute, private location: Location, private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });

    this.resetPasswordForm = new FormGroup({
      'token': new FormControl(this.token, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'password-repeat': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

    console.log(this.resetPasswordForm.value['token'])

    const url = this.router.createUrlTree([], {relativeTo: this.route, queryParams: {}}).toString()

    this.location.go(url);
  }

    resetPassword() {
        if (this.resetPasswordForm.value['password'] === this.resetPasswordForm.value['password-repeat'] ){
          this.resetPasswordForm.removeControl('password-repeat');
          this.authService.changePassword(this.resetPasswordForm.value);
        }
        else {
          this.resetPasswordForm.addControl('password-repeat', new FormControl( '',[Validators.required]));
          this.toastr.error('Passwords must match!');
        }

  }

}
