import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "../models/user";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user : User = null!;
  authenticated : boolean = false;
  authChangeSubscription : Subscription | undefined;

  constructor(private router : Router, private auth : AuthService) {
  }

  ngOnInit(): void {
    this.authChangeSubscription = this.auth.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
        if (this.authenticated) {
          this.user = this.auth.getUser();
        }
      });
  }

  getClass(a : string){
    return this.router.url == a ? 'active' : '';
  }

  logout(){
    this.auth.logout();
  }

  ngOnDestroy(){
    if (this.authChangeSubscription) {
      this.authChangeSubscription.unsubscribe();
    }
  }

}
