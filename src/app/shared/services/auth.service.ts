import { Injectable } from '@angular/core';
import {User} from "../models/User";
import {map, Observable, Subject} from "rxjs";
import {DataService} from "./data.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string | null = null;
  user: User | undefined = undefined;

  authChange: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService, private router: Router, private toastr: ToastrService) {
    this.init();
  }

  init() {
    if (this.user == null && this.getToken()) {
      this.whoAmI().subscribe(() => {
        if (!this.user) {
          this.authChange.next(false);
          this.router.navigate(['/login']);
        }
        if (this.user?.authorities.find(a => a.name == 'ADMIN')){
          this.router.navigate(['/admin']);

        } else {
          this.router.navigate(['']);
        }
      });
    }
  }

  login(credentials: { email: string, password: string }) {
    this.dataService.login(credentials)
      // @ts-ignore
      .subscribe((res: {
          status: number,
          body: {
            token?: string
          }
        }) => {
          if (res.status === 200 && res.body.token) {
            this.token = res.body.token
            localStorage.setItem('auth-token', this.token);
            //@ts-ignore
            this.whoAmI().subscribe((res: {
              status?: number,
              body: User
            }) => {
              if (res.status == 200 && res.body) {
                this.user = res.body;
                this.authChange.next(true);
                this.toastr.success(`Welcome back ${this.user.name}`)
                if (this.user.authorities.find(a => a.name == 'ADMIN')) {
                  this.router.navigate(['/admin']);
                } else {
                  this.router.navigate(['']);
                }
                return res.body;
              }
            })
          }
        }, e => {
          if (e.error.message) {
            this.toastr.error(e.error.message);
          }
        }
      )
  }

  register(user: User) {
    this.dataService.register(user)
      // @ts-ignore
      .subscribe((res: {
        status: number,
        body: {
          message: string,
        }
      }) => {
        if (res.status === 200) {
          this.toastr.success("Successful registration!");
          this.router.navigate(['/login']);
        }
      }, e => {
        if (e.error.message) {
          this.toastr.error(e.error.message);
        }
      });
  }

  requestPasswordChange(email: string) {
    this.dataService.requestPasswordChange(email)
      // @ts-ignore
      .subscribe((res: {
        status: number,
        body: {
          message: string,
        }
      }) => {
        if (res.status === 200) {
          this.toastr.success("If email exists, we will send recovery email to it.");
        }
      }, e => {
        if (e.error.message) {
          this.toastr.error(e.error.message);
        }
      });
  }

  changePassword(passwordResetDto: { token: string,  email: string, password: string }) {
    this.dataService.changePassword(passwordResetDto)
      // @ts-ignore
      .subscribe((res: {
        status: number,
        body: {
          message: string,
        }
      }) => {
        if (res.status === 200) {
          this.toastr.success("Password changed successfully");
          this.router.navigate(['/login']);
        }
      }, e => {
        if (e.error.message) {
          this.toastr.error(e.error.message);
        }
      });
  }

  //@ts-ignore
  getUser() {
    if (this.user){
      return {...this.user};
    } else if (this.isAuthenticated()) {
      //@ts-ignore
      this.auth.whoAmI().subscribe((res: {
        status?: number,
        body: User
      }) => {
        if (res.status == 200 && res.body) {
          return res.body;
        } else return null;
      })
    } else return null;
  }

  updateUser(userUpdateDto: {id: number, name: string, email: string, apiKeySlots: number, active: Boolean}) {
    this.dataService.editUser(userUpdateDto)
      // @ts-ignore
      .subscribe((res: {
          status: number,
          body: User
        }) => {
          if (res.status === 200) {
            this.logout();
          }
        }, e => {
          if (e.error.message) {
            this.toastr.error(e.error.message);
          }
        }
      )
  }

  logout() {
    if (this.user?.authorities.find(a => a.name != 'ADMIN')){
      this.toastr.success(`Goodbye!`)
    }
    this.user = undefined;
    this.token = null;
    localStorage.removeItem('auth-token');
    this.authChange.next(false);
    this.router.navigate(['/']);
  }

  getToken() {
    if (this.token) return this.token; else {
      if (localStorage.getItem('auth-token')) {
        this.token = localStorage.getItem('auth-token');
        return this.token;
      } else return false;
    }
  }

  isAuthenticated() {
    this.init();
    return this.user !== undefined;
  }

  whoAmI() {
    if (this.getToken()) {
      return this.dataService.whoAmI()
        // @ts-ignore
        .pipe(map((res: {
          status?: number,
          body: User
        }) => {
          if (res.status == 200) {
            this.user = res.body;
            this.authChange.next(true);
          }
          return res;
        }))
    } else {
      return new Observable(observer => {
        this.authChange.next(false);
        observer.next({status:100, body: {}})
      })
    }
  }

  isCurrentUserAdmin(): Boolean {
    if (this.getUser()) {
      // @ts-ignore
      return this.getUser().authorities.find(auth => auth.name == "ROLE_ADMIN") != null;
    }
    return false;
  }
}
