import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UrlComponent} from './shorten-url/url.component';
import {ToastrModule} from "ngx-toastr";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthInterceptor} from "./shared/interceptor/auth.interceptor";
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {CommonModule} from "@angular/common";
import {ClipboardModule} from "ngx-clipboard";
import {GetElementsForApiKeyByActivePipe} from "./shared/pipes/dashboard/get-elements-for-api-key-by-active.pipe";
import {GetElementsForUrlByActivePipe} from "./shared/pipes/dashboard/get-elements-for-url-by-active.pipe";
import {MaterialModule} from "./shared/material/material.module";
import { RequestPasswordResetComponent } from './auth/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import {ApiKeysComponent} from "./user-dashboard/api-keys/api-keys.component";
import {ApiKeyDetailsComponent} from "./user-dashboard/api-key-details/api-key-details.component";
import {ChangePasswordComponent} from "./user-dashboard/change-password/change-password.component";
import {EditVisitLimitComponent} from "./user-dashboard/edit-visit-limit/edit-visit-limit.component";
import {UrlsComponent} from "./user-dashboard/urls/urls.component";
import {UserDashboardRoutingModule} from "./user-dashboard/user-dashboard-routing.module";
import { MainNavComponent } from './shared/main-nav/main-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    UrlComponent,
    LoginComponent,
    RegisterComponent,
    ApiKeysComponent,
    UrlsComponent,
    ApiKeyDetailsComponent,
    GetElementsForApiKeyByActivePipe,
    GetElementsForUrlByActivePipe,
    RequestPasswordResetComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ConfirmationDialogComponent,
    EditVisitLimitComponent,
    MainNavComponent,
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
    UserDashboardRoutingModule,
    MaterialModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [
    GetElementsForApiKeyByActivePipe,
    GetElementsForUrlByActivePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
