import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { PaginationModule } from '../shared/pagination/pagination.module';



@NgModule({
  declarations: [
    DashboardComponent,
    AdvanceSearchComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class DashboardModule { }
