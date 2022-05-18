import { Component, OnInit } from '@angular/core';
import {ApiKey} from "../../shared/models/ApiKey";
import {Subscription} from "rxjs";
import {ApiKeyService} from "../../shared/services/api-key.service";
import {UrlService} from "../../shared/services/url.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.css']
})
export class ApiKeysComponent implements OnInit {

  apiKeys!: ApiKey[];
  apiKeyChangeSubscription : Subscription | undefined;
  user!: User | undefined;

  constructor(private apiKeyService: ApiKeyService, private urlService: UrlService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.apiKeys = this.apiKeyService.apiKeys;
    this.apiKeyChangeSubscription = this.apiKeyService.apiKeysChange
      .subscribe(apiKeys => {
        this.apiKeys = apiKeys
      });
    this.user = this.authService.user
  }

  revoke(id: Number) {
    this.apiKeyService.revokeApiKey(id);
  }

  createApiKey() {
    this.apiKeyService.generateNewApiKey();
  }

}
