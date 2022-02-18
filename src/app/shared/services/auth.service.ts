import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {Subject} from "rxjs";
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

  constructor(private dataService: DataService, private router: Router, private toastr : ToastrService) {
    this.init();
  }

  init(){
    this.whoAmI().subscribe(() => {
      if (!this.user) {
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
      if (this.user?.isAdmin){
        this.router.navigate(['/admin']);

      } else {
        this.router.navigate(['']);
      }
    });

  }

  login(credentials: { email: string, password: string }) {
    this.dataService.login(credentials)
      // @ts-ignore
      .subscribe((res: {
          status: number,
          body: {
            user: User,
            token?: string
          }
        }) => {
          if (res.status === 200 && res.body.token && res.body.user) {
            this.user = res.body.user;
            this.token = res.body.token
            localStorage.setItem('token', this.token);
            this.authChange.next(true);
            this.toastr.success(`Welcome back ${this.user.name}`)
            if (this.user.isAdmin) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }, e => {
          if (e.error.message) {
            this.toastr.error(e.error.message);
          }
        }
      )
  }

  register(user: { name: string, surname: string, email: string, password: string, oib: string, level: 0 }) {
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

  // @ts-ignore
  getUser() {
    if (this.user){
      return {...this.user};
    } else if (this.isAuthenticated()) {
      //@ts-ignore
      this.auth.whoAmI().subscribe((res: {
        status?: number,
        body: {
          user?: User,
        }
      }) => {
        if (res.status == 200) {
          return res.body.user;
        } else return null;
      })
    } else return null;
  }

  updateUser(user : User) {
    this.dataService.editUser(user)
      // @ts-ignore
      .subscribe((res: {
          status: number,
          body: {
            user: User,
          }
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
    if (this.user?.level == 0){
      this.toastr.success(`Thanks for banking with us ${this.user.name}.\nGoodbye!`)
    }
    this.user = undefined;
    this.token = null;
    localStorage.removeItem('token');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    if (this.token) return this.token; else {
      if (localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
        return this.token;
      } else return false;
    }
  }

  isAuthenticated() {
    this.init();
    return this.user !== undefined;
  }

  whoAmI(){
    if (this.getToken()) {
      return this.dataService.whoAmI()
        // @ts-ignore
        .pipe(map((res: {
          status?: number,
          body: {
            user?: User,
          } }) => {
          if (res.status == 200) {
            this.user = res.body.user;
            this.authChange.next(true);
          }
          return res;
        }))
    } else {
      return new Observable(observer => {
        this.authChange.next(false);
        observer.next({status:100, body : {}})
      })
    }
  }
}
