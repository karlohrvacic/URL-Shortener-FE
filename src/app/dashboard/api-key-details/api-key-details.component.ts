import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ApiKeyService} from "../../shared/services/api-key.service";
import { Location } from '@angular/common'
import {ApiKey} from "../../shared/models/ApiKey";
import {Url} from "../../shared/models/Url";
import {UrlService} from "../../shared/services/url.service";

@Component({
  selector: 'app-api-key-details',
  templateUrl: './api-key-details.component.html',
  styleUrls: ['./api-key-details.component.css']
})
export class ApiKeyDetailsComponent implements OnInit {

  subscription : Subscription = null!;
  urls!: Url[];
  urlChangeSubscription : Subscription | undefined;  apiKeyId!: Number;
  apiKey!: ApiKey;

  constructor(private route: ActivatedRoute, private router: Router, private apiKeyService: ApiKeyService, private location: Location, private urlService: UrlService) { }

  ngOnInit(): void {
    this.apiKeyId = this.route.snapshot.params['id'];
    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        this.apiKeyId = params['id'];
      });

    // @ts-ignore
    this.apiKey = this.apiKeyService.apiKeys.find(a => a.id == this.apiKeyId);
    this.urls = this.urlService.urls.filter(u => u.apiKey.id == this.apiKeyId);

    this.urlChangeSubscription = this.urlService.urlsChange
      .subscribe(urls => {
        this.urls = urls.filter(u => u.apiKey.id == this.apiKeyId)
      });
  }

  back(){
    this.location.back();
  }

  revoke() {
    this.apiKeyService.revokeApiKey(this.apiKeyId);
  }

  revokeUrl(id: Number) {
    this.urlService.revokeUrl(id);
  }
}
