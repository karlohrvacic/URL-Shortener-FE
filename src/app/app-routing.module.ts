import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UrlComponent} from "./url/url.component";
import {DashboardRoutingModule} from "./dashboard/dashboard-routing.module";
import {LoginComponent} from "./dashboard/login/login.component";
import {RegisterComponent} from "./dashboard/register/register.component";

const routes: Routes = [
  {path:'dashboard', loadChildren: () => DashboardRoutingModule},
  {path:'login', component : LoginComponent},
  {path:'register', component : RegisterComponent},
  {path:'', component : UrlComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
