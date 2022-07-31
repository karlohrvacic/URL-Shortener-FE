import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {UrlService} from "../shared/services/url.service";
import {FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {Url} from "../shared/models/Url";
import { ClipboardService } from 'ngx-clipboard';
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {ApiKeyService} from "../shared/services/api-key.service";

@Component({
  selector: 'app-shorten-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent implements OnInit {

  shortenerForm!: UntypedFormGroup;
  url!: Url | null;
  authenticated: boolean = false;
  authChangeSubscription: Subscription | undefined;
  urlSubmittedSubscription: Subscription | undefined;
  urlForClipboard!: string;
  noExpirationDate: boolean = true;
  dateNow: Date = new Date()

  reg = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

  constructor(private urlService: UrlService, private authService: AuthService, private clipboardApi: ClipboardService,
              private toastr: ToastrService, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    this.authenticated = this.authService.isAuthenticated()
    this.authChangeSubscription = this.authService.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
      });

    this.urlSubmittedSubscription = this.urlService.urlChange
      .subscribe(() => {
        this.url = this.urlService.url
        this.urlForClipboard = this.url.shortUrl;
        this.copyToClipboard()
        this.shortenerForm.reset('')
        this.shortenerForm.markAsPristine();
        this.shortenerForm.markAsUntouched();
        this.shortenerForm.updateValueAndValidity();
        if (this.authenticated) {
          this.apiKeyService.getAllMyApiKeys()
          this.urlService.getMyUrls()
        }
      })


    this.shortenerForm = new UntypedFormGroup({
      'longUrl': new UntypedFormControl(null, [Validators.required, Validators.pattern(this.reg)]),
      'shortUrl': new UntypedFormControl(null),
      'visitLimit': new UntypedFormControl(null, [Validators.min(1)]),
      'expirationDate': new UntypedFormControl(null)
    });
  }


  ngOnDestroy() {
    this.authChangeSubscription?.unsubscribe();
    this.urlSubmittedSubscription?.unsubscribe()
  }

  submit() {
    this.urlService.addUrl(this.shortenerForm.value);
  }

  copyToClipboard() {
    if (this.urlForClipboard != null) {
      this.clipboardApi.copyFromContent(environment.API_URL + "/" + this.urlForClipboard)
      this.toastr.success("Url has been copied to clipboard")
    }
  }

}
