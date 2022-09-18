import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UrlComponent} from "./public/shorten-url/url.component";
import {UserDashboardRoutingModule} from "./user-dashboard/user-dashboard-routing.module";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {UserGuard} from "./shared/guards/user.guard";
import {ResetPasswordComponent} from "./auth/reset-password/reset-password.component";
import {PeekUrlComponent} from "./public/peek-url/peek-url.component";

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'reset-password', component: ResetPasswordComponent},
  {path:'validate', component: PeekUrlComponent},
  {path:'dashboard', loadChildren: () => UserDashboardRoutingModule, canActivate: [UserGuard]},
  {path:'', component: UrlComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
