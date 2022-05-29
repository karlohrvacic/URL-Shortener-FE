import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {Subject, Subscription} from "rxjs";
import {ApiKey} from "../models/ApiKey";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  apiKeys: ApiKey[] = null!;
  apiKeysChange: Subject<ApiKey[]> = new Subject<ApiKey[]>();

  allApiKeys: ApiKey[] = null!;
  allApiKeysChange: Subject<ApiKey[]> = new Subject<ApiKey[]>();

  authenticated: boolean = false;
  authChangeSubscription: Subscription | undefined;

  constructor(private dataService: DataService, private toastr: ToastrService, private authService: AuthService) {
    this.init()
  }

  init() {
    this.authenticated = this.authService.isAuthenticated()
    this.authChangeSubscription = this.authService.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
        if (this.authenticated) {
          this.getAllMyApiKeys();
        }
      });
  }

  getAllMyApiKeys() {
    this.dataService.getAllMyApiKeys()
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: ApiKey[]
      })  => {
        if (res.status == 200) {
          this.apiKeys = res.body;
          this.apiKeysChange.next(this.apiKeys);
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  getAllApiKeys() {
    this.dataService.getAllApiKeys()
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: ApiKey[]
      })  => {
        if (res.status == 200) {
          this.apiKeys = res.body;
          this.apiKeysChange.next(this.apiKeys);
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  generateNewApiKey() {
    this.dataService.createApiKey()
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: ApiKey
      })  => {
        if (res.status == 200) {
          this.toastr.success("API key added successfully");
          console.log(this.authService.isCurrentUserAdmin())
          if (this.authService.isCurrentUserAdmin()) {
            this.getAllApiKeys();
          }
          this.getAllMyApiKeys()
        }
    }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  revokeApiKey(id: number) {
    this.dataService.revokeApiKey(id)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: ApiKey
      })  => {
        if (res.status == 200) {
          this.toastr.success("API key successfully revoked");
          if (this.authService.isCurrentUserAdmin()) {
            this.getAllApiKeys();
          }
          this.getAllMyApiKeys()
        }
    }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  editApiKey(apiKeyUpdateDto: { id: number, apiCallsLimit: number, apiCallsUsed: number, expirationDate: Date, active: Boolean}) {
    this.dataService.editApiKey(apiKeyUpdateDto)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: ApiKey
      })  => {
        if (res.status == 200) {
          this.toastr.success("API key successfully updated");
          if (this.authService.isCurrentUserAdmin()) {
            this.getAllApiKeys();
          }
          this.getAllMyApiKeys()
        }
    }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }
}
