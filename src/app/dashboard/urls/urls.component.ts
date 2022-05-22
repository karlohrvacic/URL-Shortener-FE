import { Component, OnInit } from '@angular/core';
import {Url} from "../../shared/models/Url";
import {Subscription} from "rxjs";
import {UrlService} from "../../shared/services/url.service";
import {ToastrService} from "ngx-toastr";
import {ClipboardService} from "ngx-clipboard";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.css']
})
export class UrlsComponent implements OnInit {

  urls!: Url[];
  urlChangeSubscription: Subscription | undefined;  apiKeyId!: Number;

  constructor(private urlService: UrlService, private toastr: ToastrService, private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.urls = this.urlService.urls;

    this.urlChangeSubscription = this.urlService.urlsChange
      .subscribe(urls => {
        this.urls = urls.filter(u => u.apiKey.id == this.apiKeyId)
      });
  }

  revokeUrl(id: Number) {
    this.urlService.revokeUrl(id);
  }

  copyUrl(id: Number) {
    // @ts-ignore
    this.clipboardApi.copyFromContent(environment.API_URL + "/" + this.urls.find(url => id == url.id).shortUrl)
    this.toastr.success("Url has been copied to clipboard")
  }

}
