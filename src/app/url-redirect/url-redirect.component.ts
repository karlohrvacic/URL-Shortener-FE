import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UrlService} from "../shared/services/url.service";

@Component({
  selector: 'app-url-redirect',
  templateUrl: './url-redirect.component.html',
  styleUrls: ['./url-redirect.component.css']
})
export class UrlRedirectComponent implements OnInit {

  shortUrl? : string;


  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit(): void {
    console.log("Redirecting...")
    this.shortUrl = this.route.snapshot.params['shortUrl'];
    if (this.shortUrl) {
      this.urlService.redirectToUrlByShortUrl(this.shortUrl);
    }
  }

}
