import { Component, OnInit } from '@angular/core';
import {ApiKeyService} from "../../shared/services/api-key.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User | undefined;

  constructor(private apiKeyService: ApiKeyService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user;
  }

}
