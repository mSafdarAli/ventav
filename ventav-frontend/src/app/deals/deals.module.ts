import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealsRoutingModule } from './deals-routing.module';
import { DealComponent } from './deal/deal.component';
import { AddDealComponent } from './deal/add-deal/add-deal.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { ViewDealComponent } from './deal/view-deal/view-deal.component';
import { CheckoutIframeComponent } from './deal/checkout-iframe/checkout-iframe.component';


@NgModule({
  declarations: [
    DealComponent,
    AddDealComponent,
    ViewDealComponent,
    CheckoutIframeComponent
  ],
  imports: [
    CommonModule,
    DealsRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class DealsModule { }
