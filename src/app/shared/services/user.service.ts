import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = null!;
  usersChange: Subject<User[]> = new Subject<User[]>();

  constructor(private dataService: DataService, private toastr: ToastrService) { }

  getAllUsers() {
    this.dataService.getAllUsers()
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: User[],
      }) => {
        if (res) {
          this.users = res.body;
          this.usersChange.next(this.users);
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

  deactivateUser(id: number) {
    this.dataService.deleteUser(id)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: User,
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

  editUser(userUpdateDto: {id: number, name: string, email: string, apiKeySlots: number, active: Boolean}) {
    this.dataService.editUser(userUpdateDto)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: User,
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

  updatePassword(updatePasswordDto: {oldPassword: string, newPassword: string}) {
    this.dataService.updatePassword(updatePasswordDto)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: User,
      }) => {
        if (res) {
          this.toastr.success("Password changed successfully");
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }
}
