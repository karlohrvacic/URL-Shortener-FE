import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApiKeysComponent} from "./api-keys/api-keys.component";
import {UrlsComponent} from "./urls/urls.component";
import {ApiKeyDetailsComponent} from "./api-key-details/api-key-details.component";


const routes: Routes = [
  {path:'api-keys', component: ApiKeysComponent},
  {path:'api-key/:id', component: ApiKeyDetailsComponent},
  {path:'urls', component: UrlsComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
