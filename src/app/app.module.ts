import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UrlComponent} from './url/url.component';
import {ToastrModule} from "ngx-toastr";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NavbarComponent} from './shared/navbar/navbar.component';
import {AuthInterceptor} from "./shared/auth.interceptor";
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ClipboardModule} from "ngx-clipboard";
import {DashboardRoutingModule} from "./dashboard/dashboard-routing.module";
import {ApiKeysComponent} from './dashboard/api-keys/api-keys.component';
import {UrlsComponent} from './dashboard/urls/urls.component';
import {ProfileComponent} from './dashboard/profile/profile.component';
import {ApiKeyDetailsComponent} from './dashboard/api-key-details/api-key-details.component';
import {ApiKeyStatsPipe} from "./shared/pipe/api-key-stats.pipe";
import {ApiKeysAllowedActivePipe} from "./shared/pipe/api-keys-allowed-active.pipe";
import {GetElementsForApiKeyByActivePipe} from "./shared/pipe/get-elements-for-api-key-by-active.pipe";
import {GetElementsForUrlByActivePipe} from "./shared/pipe/get-elements-for-url-by-active.pipe";
import {UrlStatsPipe} from "./shared/pipe/url-stats.pipe";
import {UrlStatsActivityPipe} from "./shared/pipe/url-stats-activity.pipe";
import {UrlsTotalClicksPipe} from "./shared/pipe/urls-total-clicks.pipe";

@NgModule({
  declarations: [
    AppComponent,
    UrlComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ApiKeysComponent,
    UrlsComponent,
    ProfileComponent,
    ApiKeyDetailsComponent,
    ApiKeyStatsPipe,
    ApiKeysAllowedActivePipe,
    GetElementsForApiKeyByActivePipe,
    GetElementsForUrlByActivePipe,
    UrlStatsPipe,
    UrlStatsActivityPipe,
    UrlsTotalClicksPipe,
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    DashboardRoutingModule,
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
