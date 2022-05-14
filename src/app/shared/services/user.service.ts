import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users : User[] = null!;
  userChange: Subject<User[]> = new Subject<User[]>();

  constructor(private dataService : DataService, private toastr : ToastrService) { }

  getAllUsers() {
    this.dataService.getAllUsers()
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : User[],
      }) => {
        if (res) {
          this.users = res.body;
          this.userChange.next(this.users);
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

  deactivateUser(id: Number) {
    this.dataService.deleteUser(id)
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : User,
      }) => {
        if (res) {
          this.toastr.success("User has been deactivated");
          this.getAllUsers()
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

  editUser(userUpdateDto: {id: Number, name: String, email: String, apiKeySlots: Number, active: Boolean}) {
    this.dataService.editUser(userUpdateDto)
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : User,
      }) => {
        if (res) {
          this.toastr.success("User has been edited");
          this.getAllUsers()
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }
}
