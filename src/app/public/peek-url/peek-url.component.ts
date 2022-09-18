import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {Url} from "../../shared/models/Url";
import {Subscription} from "rxjs";
import {UrlService} from "../../shared/services/url.service";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment";
import {ClipboardService} from "ngx-clipboard";

@Component({
  selector: 'app-peek-url',
  templateUrl: './peek-url.component.html',
  styleUrls: ['./peek-url.component.css']
})
export class PeekUrlComponent implements OnInit {

  peekForm!: UntypedFormGroup;
  url!: Url | null;
  urlPeekSubscription: Subscription | undefined;
  backendUrl: string = environment.API_URL;
  urlScanUrl: string = 'https://www.urlvoid.com/scan/';

  constructor(private urlService: UrlService, private toastr: ToastrService, private clipboardApi: ClipboardService) { }

  ngOnInit(): void {

    this.urlPeekSubscription = this.urlService.peekUrlChange
      .subscribe(() => {
        this.url = this.urlService.peekUrl
      })

    this.peekForm = new UntypedFormGroup({
      'shortUrl': new UntypedFormControl(null)
    });
  }

  ngOnDestroy() {
    this.urlPeekSubscription?.unsubscribe()
  }

  submit() {
    this.urlService.peekUrlFromShortUrl(this.peekForm.value['shortUrl']);
  }

  redirectToUrl() {
    if (this.url != null) {
      window.location.href = this.url.longUrl
    }
  }

  scanUrl() {
    if (this.url != null) {
      window.open(
        this.urlScanUrl + (new URL(this.url.longUrl)).hostname,
        '_blank'
      );
    }
  }

  copyToClipboard() {
    if (this.url != null) {
      this.clipboardApi.copyFromContent(this.url.longUrl)
      this.toastr.success("Full long url has been copied to clipboard")
    }
  }

}
