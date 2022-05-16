import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {DataService} from "./data.service";
import {Url} from "../models/Url";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  url : Url = null!;
  urlChange: Subject<Url> = new Subject<Url>();

  urls : Url[] = null!;
  urlsChange: Subject<Url[]> = new Subject<Url[]>();

  allUrls : Url[] = null!;
  allUrlsChange: Subject<Url[]> = new Subject<Url[]>();

  constructor(private dataService : DataService, private toastr : ToastrService, private router: Router) {
    this.init()
  }

  init() {
    this.getMyUrls();
  }

  addUrl(url : Url) : Url | null {
    this.dataService.createUrlWithoutApiKey(url)
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : Url,
      }) => {
        if (res) {
          this.toastr.success("URL successfully shortened!");
          this.url = res.body;
          this.urlChange.next(this.url);
          return this.url;
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

  getMyUrls() : Url | null {
    this.dataService.getMyUrls()
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : Url[],
      }) => {
        if (res) {
          this.urls = res.body;
          this.urlsChange.next(this.urls);
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

  getAllUrls() : Url | null {
    this.dataService.getAllUrls()
      //@ts-ignore
      .subscribe((res : {
        status?: number,
        body : Url[],
      }) => {
        if (res) {
          this.allUrls = res.body;
          this.allUrlsChange.next(this.allUrls);
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

}
