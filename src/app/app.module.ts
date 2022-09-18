import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UrlComponent} from './public/shorten-url/url.component';
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
import { MainNavComponent } from './public/main-nav/main-nav.component';
import { ProfileViewComponent } from './user-dashboard/profile-view/profile-view.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import { PeekUrlComponent } from './public/peek-url/peek-url.component';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

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
    ProfileViewComponent,
    PeekUrlComponent,
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
        MatDatepickerModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule
    ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: OWL_DATE_TIME_LOCALE, useValue: MY_MOMENT_FORMATS}
  ],
  exports: [
    GetElementsForApiKeyByActivePipe,
    GetElementsForUrlByActivePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
