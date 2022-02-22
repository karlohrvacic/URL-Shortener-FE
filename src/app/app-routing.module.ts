import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UrlComponent} from "./url/url.component";
import {UrlRedirectComponent} from "./url-redirect/url-redirect.component";
import {DashboardRoutingModule} from "./dashboard/dashboard-routing.module";

const routes: Routes = [
  {path:'dashboard', loadChildren: () => DashboardRoutingModule},
  {path:'', component : UrlComponent},
  {path:':shortUrl', component : UrlRedirectComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
