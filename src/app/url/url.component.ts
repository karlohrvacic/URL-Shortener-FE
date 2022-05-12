import { Component, OnInit } from '@angular/core';
import {UrlService} from "../shared/services/url.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {Url} from "../shared/models/Url";
import { ClipboardService } from 'ngx-clipboard';
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent implements OnInit {

  shortenerForm! : FormGroup;
  url!: Url | null;
  authenticated : boolean = false;
  authChangeSubscription : Subscription | undefined;
  urlSubitedSubscription : Subscription | undefined;
  urlForClipboard!: string;

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(private urlService : UrlService, private authService : AuthService, private clipboardApi: ClipboardService,
              private toastr : ToastrService) { }

  ngOnInit(): void {
    this.authenticated = this.authService.isAuthenticated()

    this.authChangeSubscription = this.authService.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
      });

    this.urlSubitedSubscription = this.urlService.urlChange
      .subscribe(() => {
        this.url = this.urlService.url
        this.urlForClipboard = environment.API_URL + "/" + this.url.shortUrl;
        this.copyToClipboard()
      })

    this.shortenerForm = new FormGroup({
      'longUrl' : new FormControl(null, [Validators.required, Validators.pattern(this.reg)]),
      'shortUrl' : new FormControl(null)
    });
  }

  submit() {
    this.urlService.addUrl(this.shortenerForm.value);
  }

  copyToClipboard() {
    if (this.urlForClipboard != null) {
      this.clipboardApi.copyFromContent(this.urlForClipboard)
      this.toastr.success("Url has been copied to clipboard")
    }
  }

}
