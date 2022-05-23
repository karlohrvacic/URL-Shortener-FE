import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";

const MaterialComponents = [
  CommonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})

export class MaterialModule { }
