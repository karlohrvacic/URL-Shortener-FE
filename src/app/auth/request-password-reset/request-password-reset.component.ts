import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css']
})
export class RequestPasswordResetComponent implements OnInit {

  constructor(private authService: AuthService, public dialogRef: MatDialogRef<RequestPasswordResetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  requestPasswordResetForm!: FormGroup;

  ngOnInit() {
    this.requestPasswordResetForm = new FormGroup({
      'email': new FormControl(this.data, [Validators.required, Validators.email]),
    });
  }


  onSend() {
    this.authService.requestPasswordChange(this.requestPasswordResetForm.value);
  }

}
