import { Component, OnInit } from '@angular/core';
import {UrlService} from "../shared/services/url.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent implements OnInit {

  shortenerForm! : FormGroup;
  authenticated : boolean = false;
  authChangeSubscription : Subscription | undefined;

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(private urlService : UrlService, private authService : AuthService) { }

  ngOnInit(): void {

    this.authChangeSubscription = this.authService.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
      });

    this.shortenerForm = new FormGroup({
      'longUrl' : new FormControl(null, [Validators.required, Validators.pattern(this.reg)]),
      'shortUrl' : new FormControl(null)
    });
  }

  submit() {
    this.urlService.addUrl(this.shortenerForm.value);
  }

}
