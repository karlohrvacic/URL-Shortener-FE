import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "../models/User";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {RequestPasswordResetComponent} from "../../auth/request-password-reset/request-password-reset.component";
import {ChangePasswordComponent} from "../../dashboard/change-password/change-password.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | null = null;
  authenticated: boolean = false;
  authChangeSubscription: Subscription | undefined;
  userInfo!: string;

  constructor(private router: Router, private authService: AuthService, public location: Location, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.authChangeSubscription = this.authService.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
        if (this.authenticated) {
          // @ts-ignore
          this.user = this.authService.getUser();
          this.userInfo = "Name: " + this.user?.name + "\nEmail: " + this.user?.email + "\nMax active API keys: " + this.user?.apiKeySlots.toString();
        }
      });
  }

  getClass(a: string){
    return this.router.url == a ? 'active': '';
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    if (this.authChangeSubscription) {
      this.authChangeSubscription.unsubscribe();
    }
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '30%',
    })
  }

}
