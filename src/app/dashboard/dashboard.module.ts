import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppModule} from "../app.module";

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    AppModule,
    BrowserModule,
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
  ],
  exports: []
})
export class DashboardModule { }
