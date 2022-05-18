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
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ClipboardModule} from "ngx-clipboard";
import {DashboardModule} from "./dashboard/dashboard.module";
import {DashboardComponent} from "./dashboard/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard/dashboard-routing.module";
import { ApiKeyStatsPipe } from './shared/pipes/dashboard/api-key-stats.pipe';
import { UrlStatsPipe } from './shared/pipes/dashboard/url-stats.pipe';
import { UrlStatsActivityPipe } from './shared/pipes/dashboard/url-stats-activity.pipe';
import { UrlsTotalClicksPipe } from './shared/pipes/dashboard/urls-total-clicks.pipe';
import { ApiKeysAllowedActivePipe } from './shared/pipes/dashboard/api-keys-allowed-active.pipe';
import { ApiKeysComponent } from './dashboard/api-keys/api-keys.component';
import { UrlsComponent } from './dashboard/urls/urls.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { GetActiveElementsForApiKeyPipe } from './shared/pipes/dashboard/get-active-elements.pipe';
import { ApiKeyDetailsComponent } from './dashboard/api-key-details/api-key-details.component';
import { GetActiveElementsForUrlPipe } from './shared/pipes/dashboard/get-active-elements-for-url.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UrlComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ApiKeyStatsPipe,
    UrlStatsPipe,
    UrlStatsActivityPipe,
    UrlsTotalClicksPipe,
    ApiKeysAllowedActivePipe,
    ApiKeysComponent,
    UrlsComponent,
    ProfileComponent,
    GetActiveElementsForApiKeyPipe,
    ApiKeyDetailsComponent,
    GetActiveElementsForUrlPipe,
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
    DashboardRoutingModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [
    ApiKeyStatsPipe,
    UrlStatsPipe,
    UrlsTotalClicksPipe,
    UrlStatsActivityPipe,
    ApiKeysAllowedActivePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
