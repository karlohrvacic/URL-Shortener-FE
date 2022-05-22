import { Component, OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ApiKeyService} from "../../shared/services/api-key.service";
import {Subscription} from "rxjs";
import {ApiKey} from "../../shared/models/ApiKey";
import {User} from "../../shared/models/User";
import {AuthService} from "../../shared/services/auth.service";
import {Url} from "../../shared/models/Url";
import {UrlService} from "../../shared/services/url.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  apiKeys!: ApiKey[];
  apiKeyChangeSubscription: Subscription | undefined;

  urls!: Url[];
  urlChangeSubscription: Subscription | undefined;
  user!: User | undefined;

  constructor(private apiKeyService: ApiKeyService, private urlService: UrlService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.apiKeys = this.apiKeyService.apiKeys;
    this.apiKeyChangeSubscription = this.apiKeyService.apiKeysChange
      .subscribe(apiKeys => {
        this.apiKeys = apiKeys
      });

    this.urls = this.urlService.urls;
    this.urlChangeSubscription = this.urlService.urlsChange
      .subscribe(urls => {
        this.urls = urls
      });

    this.user = this.authService.user;

    this.apiKeys = this.apiKeyService.apiKeys;
    this.apiKeyChangeSubscription = this.apiKeyService.apiKeysChange
      .subscribe(apiKeys => {
        this.apiKeys = apiKeys
      });
  }

}
