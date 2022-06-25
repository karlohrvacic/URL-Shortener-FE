import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../shared/models/User";
import {ChangePasswordComponent} from "../change-password/change-password.component";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  user?: User;

  constructor(public dialogRef: MatDialogRef<ProfileViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = this.data
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordComponent)
  }


}
