import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponRoutingModule } from './coupon-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { ExportCodesComponent } from './export-codes/export-codes.component';


@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    ViewComponent,
    ExportCodesComponent
  ],
  imports: [
    CommonModule,
    CouponRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class CouponModule { }
