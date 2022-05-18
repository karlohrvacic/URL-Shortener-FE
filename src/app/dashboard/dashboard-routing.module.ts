import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ApiKeysComponent} from "./api-keys/api-keys.component";
import {UrlsComponent} from "./urls/urls.component";
import {ProfileComponent} from "./profile/profile.component";
import {ApiKeyDetailsComponent} from "./api-key-details/api-key-details.component";


const routes: Routes = [
  {path:'', component : DashboardComponent},
  {path:'api-keys', component : ApiKeysComponent},
  {path:'api-key/:id', component : ApiKeyDetailsComponent},
  {path:'urls', component : UrlsComponent},
  {path:'profile', component : ProfileComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
