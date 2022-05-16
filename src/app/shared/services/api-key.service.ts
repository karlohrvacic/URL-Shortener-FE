import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {ApiKey} from "../models/ApiKey";

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  apiKeys : ApiKey[] = null!;
  apiKeysChange: Subject<ApiKey[]> = new Subject<ApiKey[]>();

  allApiKeys : ApiKey[] = null!;
  allApiKeysChange: Subject<ApiKey[]> = new Subject<ApiKey[]>();

  constructor(private dataService : DataService, private toastr : ToastrService) {
    this.init()
  }

  init() {
    this.getAllMyApiKeys();
  }

  getAllMyApiKeys() {
    this.dataService.getAllMyApiKeys()
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : ApiKey[]
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
      .subscribe((res : {
        status?: number,
        body : ApiKey[]
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
      .subscribe((res : {
        status?: number,
        body : ApiKey
      })  => {
        if (res.status == 200) {
          this.toastr.success("API key added successfully");
          this.getAllApiKeys();
        }
    }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  revokeApiKey(id: Number) {
    this.dataService.revokeApiKey(id)
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : ApiKey
      })  => {
        if (res.status == 200) {
          this.toastr.success("API key successfully revoked");
          this.getAllApiKeys();
        }
    }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  editApiKey(apiKeyUpdateDto: { id: Number, apiCallsLimit: Number, apiCallsUsed: Number, expirationDate: Date, active: Boolean}) {
    this.dataService.editApiKey(apiKeyUpdateDto)
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : ApiKey
      })  => {
        if (res.status == 200) {
          this.toastr.success("API key successfully updated");
          this.getAllApiKeys();
        }
    }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }
}
