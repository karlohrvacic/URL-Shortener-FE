import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UrlComponent} from './shorten-url/url.component';
import {ToastrModule} from "ngx-toastr";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NavbarComponent} from './shared/navbar/navbar.component';
import {AuthInterceptor} from "./shared/interceptor/auth.interceptor";
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {CommonModule} from "@angular/common";
import {ClipboardModule} from "ngx-clipboard";
import {DashboardRoutingModule} from "./dashboard/dashboard-routing.module";
import {ApiKeysComponent} from './dashboard/api-keys/api-keys.component';
import {UrlsComponent} from './dashboard/urls/urls.component';
import {ApiKeyDetailsComponent} from './dashboard/api-key-details/api-key-details.component';
import {ApiKeyStatsPipe} from "./shared/pipes/dashboard/api-key-stats.pipe";
import {ApiKeysAllowedActivePipe} from "./shared/pipes/dashboard/api-keys-allowed-active.pipe";
import {UrlStatsPipe} from "./shared/pipes/dashboard/url-stats.pipe";
import {UrlsTotalClicksPipe} from "./shared/pipes/dashboard/urls-total-clicks.pipe";
import {UrlStatsActivityPipe} from "./shared/pipes/dashboard/url-stats-activity.pipe";
import {GetElementsForApiKeyByActivePipe} from "./shared/pipes/dashboard/get-elements-for-api-key-by-active.pipe";
import {GetElementsForUrlByActivePipe} from "./shared/pipes/dashboard/get-elements-for-url-by-active.pipe";
import {MaterialModule} from "./shared/material/material.module";
import { RequestPasswordResetComponent } from './auth/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    UrlComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ApiKeysComponent,
    UrlsComponent,
    ApiKeyDetailsComponent,
    ApiKeyStatsPipe,
    ApiKeysAllowedActivePipe,
    GetElementsForApiKeyByActivePipe,
    GetElementsForUrlByActivePipe,
    UrlStatsPipe,
    UrlStatsActivityPipe,
    UrlsTotalClicksPipe,
    RequestPasswordResetComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left',
      progressBar: true,
      closeButton: true,
      maxOpened: 5,
      preventDuplicates: true
    }),
    FormsModule,
    ClipboardModule,
    DashboardRoutingModule,
    MaterialModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [
    ApiKeyStatsPipe,
    ApiKeysAllowedActivePipe,
    GetElementsForApiKeyByActivePipe,
    GetElementsForUrlByActivePipe,
    UrlStatsPipe,
    UrlStatsActivityPipe,
    UrlsTotalClicksPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
