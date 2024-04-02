import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedeemRoutingModule } from './redeem-routing.module';
import { RedeemCouponComponent } from './redeem-coupon/redeem-coupon.component';
import { FormControllerModule } from 'src/app/shared/form-controller/form-controller.module';


@NgModule({
  declarations: [
    RedeemCouponComponent
  ],
  imports: [
    CommonModule,
    RedeemRoutingModule,
    FormControllerModule
  ]
})
export class RedeemModule { }
