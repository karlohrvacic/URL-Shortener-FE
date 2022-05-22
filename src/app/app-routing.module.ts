import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UrlComponent} from "./url/url.component";
import {DashboardRoutingModule} from "./dashboard/dashboard-routing.module";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {UserGuard} from "./shared/guards/user.guard";

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'dashboard', loadChildren: () => DashboardRoutingModule, canActivate: [UserGuard]},
  {path:'', component: UrlComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
