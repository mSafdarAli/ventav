import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantsComponent } from './merchants/merchants.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { AddMerchantsComponent } from './add-merchants/add-merchants.component';
import { ViewMerchantComponent } from './view-merchant/view-merchant.component';


@NgModule({
  declarations: [
    MerchantsComponent,
    AddMerchantsComponent,
    ViewMerchantComponent
  ],
  imports: [
    CommonModule,
    MerchantRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class MerchantModule { }
