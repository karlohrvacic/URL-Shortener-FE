import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UrlComponent} from "./url/url.component";
import {UrlRedirectComponent} from "./url-redirect/url-redirect.component";

const routes: Routes = [
  {path:'', component : UrlComponent},
  {path:':shortUrl', component : UrlRedirectComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
