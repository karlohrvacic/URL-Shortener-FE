import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {DataService} from "./data.service";
import {Url} from "../models/url";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  url : Url = null!;

  constructor(private dataService : DataService, private toastr : ToastrService, private router: Router) { }

  addUrl(url : Url){
    this.dataService.addUrl(url)
      //@ts-ignore
      .subscribe((res : {
        body : Url
      }) => {
        if (res) {
          this.toastr.success("URL successfully shortened!");
          this.url = res.body;
        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
        }
      });
  }

  redirectToUrlByShortUrl(shortUrl : String){
    this.dataService.getUrlByShortUrl(shortUrl)
      //@ts-ignore
      .subscribe((res : {
        body : Url
      }) => {
        if (res) {
          this.toastr.success("Redirecting!");
           this.url = res.body;
          console.log(res.body);
          window.location.href = this.url.longUrl.toString();

        }
      }, e => {
        if (e) {
          this.toastr.error(e.error.message);
          this.router.navigate(['/']);

        }
      });
  }

}
