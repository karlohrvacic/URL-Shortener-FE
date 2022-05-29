import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {DataService} from "./data.service";
import {Url} from "../models/Url";
import {Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {ApiKey} from "../models/ApiKey";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  url: Url = null!;
  urlChange: Subject<Url> = new Subject<Url>();

  urls: Url[] = null!;
  urlsChange: Subject<Url[]> = new Subject<Url[]>();

  allUrls: Url[] = null!;
  allUrlsChange: Subject<Url[]> = new Subject<Url[]>();

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
          this.getMyUrls();
        }
      });
  }

  addUrl(url: Url): Url | null {
    this.dataService.createUrlWithoutApiKey(url)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: Url,
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

  getMyUrls(): Url | null {
    this.dataService.getMyUrls()
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: Url[],
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

  getAllUrls(): Url | null {
    this.dataService.getAllUrls()
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: Url[],
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

  revokeUrl(id: number) {
    this.dataService.revokeUrl(id)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: Url[],
      }) => {
        if (res) {
          this.toastr.success("URL successfully deactivated!");
          return this.getMyUrls();
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  changeUrlVisitLimit(urlUpdateDto: { id: number, visitLimit: number }) {
    this.dataService.updateUrl(urlUpdateDto)
      //@ts-ignore
      .subscribe((res: {
        status?: number,
        body: Url[],
      }) => {
        if (res) {
          this.toastr.success("URL successfully updated!");
          return this.getMyUrls();
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }
}
