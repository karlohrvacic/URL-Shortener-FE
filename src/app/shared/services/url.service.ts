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
  urlChange: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService : DataService, private toastr : ToastrService, private router: Router) { }

  addUrl(url : Url) : Url | null {
    this.dataService.createUrlWithoutApiKey(url)
      //@ts-ignore
      .subscribe((res : {
        body : Url
      }) => {
        if (res) {
          this.toastr.success("URL successfully shortened!");
          this.url = res.body;
          this.urlChange.next(true);
          return this.url;
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
    return null;
  }

}
