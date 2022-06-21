import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {User} from "../models/User";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordComponent} from "../../user-dashboard/change-password/change-password.component";
import {ProfileViewComponent} from "../../user-dashboard/profile-view/profile-view.component";

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  user: User | null = null;
  authenticated: boolean = false;
  authChangeSubscription: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService, public location: Location, private dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.authChangeSubscription = this.authService.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
        if (this.authenticated) {
          // @ts-ignore
          this.user = this.authService.getUser();
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
    this.dialog.open(ChangePasswordComponent)
  }

  openUserProfileInfo() {
    this.dialog.open(ProfileViewComponent, {
      data: this.user
    })
  }
}
